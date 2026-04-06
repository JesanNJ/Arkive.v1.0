import RNFS from 'react-native-fs';
import CryptoJS from 'crypto-js';

const CHUNK_SIZE = 1024 * 1024;

const copyToTempFile = async (fileUri: string, fileName: string): Promise<string> => {
  const tempPath = `${RNFS.CachesDirectoryPath}/temp_${fileName}`;
  const exists = await RNFS.exists(tempPath);
  if (exists) await RNFS.unlink(tempPath);
  await RNFS.copyFile(fileUri, tempPath);
  console.log('✅ Copied to temp:', tempPath);
  return tempPath;
};

export const encryptFileInChunks = async (
  fileUri: string,
  key: string,
  fileName: string,
  onProgress?: (percent: number) => void
): Promise<string> => {
  try {
    console.log('📁 Raw fileUri received:', fileUri);

    const realPath = await copyToTempFile(fileUri, fileName);
    console.log('📁 Real path:', realPath);

    const stat = await RNFS.stat(realPath);
    const fileSizeBytes = stat.size;
    const totalBase64Length = Math.ceil(fileSizeBytes * 4 / 3);
    const numChunks = Math.ceil(totalBase64Length / CHUNK_SIZE);

    console.log(`📊 File: ${fileSizeBytes} bytes`);
    console.log(`📦 Chunks: ${numChunks}`);

    const outputPath = `${RNFS.DocumentDirectoryPath}/${fileName}.ark`;

    // Delete old .ark if exists
    const oldExists = await RNFS.exists(outputPath);
    if (oldExists) await RNFS.unlink(outputPath);

    // Write metadata + opening of chunks array
    const metadata = {
      originalName: fileName,
      numChunks,
      fileSizeBytes,
      version: '3',
      encryptedAt: new Date().toISOString(),
    };

    // Write file piece by piece — never hold all chunks in memory
    // Format: {"metadata":{...},"chunks":["chunk1","chunk2",...]}
    await RNFS.writeFile(
      outputPath,
      `{"metadata":${JSON.stringify(metadata)},"chunks":[`,
      'utf8'
    );

    for (let i = 0; i < numChunks; i++) {
      const base64Start = i * CHUNK_SIZE;
      const base64End = Math.min(base64Start + CHUNK_SIZE, totalBase64Length);

      const byteStart = Math.floor(base64Start * 3 / 4);
      const byteLength = Math.min(
        Math.ceil((base64End - base64Start) * 3 / 4),
        fileSizeBytes - byteStart
      );

      const chunkBase64 = await RNFS.read(realPath, byteLength, byteStart, 'base64');
      const encrypted = CryptoJS.AES.encrypt(chunkBase64, key).toString();

      // Append chunk as JSON string — comma before every chunk except first
      const chunkJson = (i > 0 ? ',' : '') + JSON.stringify(encrypted);
      await RNFS.appendFile(outputPath, chunkJson, 'utf8');

      const percent = Math.round(((i + 1) / numChunks) * 100);
      onProgress?.(percent);
      console.log(`✅ Chunk ${i + 1}/${numChunks} (${percent}%)`);
    }

    // Close the JSON array and object
    await RNFS.appendFile(outputPath, ']}', 'utf8');

    // Clean up temp file
    await RNFS.unlink(realPath);

    console.log('✅ Encrypted file saved:', outputPath);
    return outputPath;
  } catch (error) {
    console.error('❌ Encryption error:', error);
    throw error;
  }
};

export const decryptFileInChunks = async (
  encryptedFileUri: string,
  key: string,
  onProgress?: (percent: number) => void
): Promise<{ path: string; originalName: string }> => {
  try {
    console.log('🔓 Starting decryption');

    // Handle content:// URIs by copying to temp first
let cleanUri: string;
if (encryptedFileUri.startsWith('content://')) {
  const tempPath = `${RNFS.CachesDirectoryPath}/temp_decrypt_${Date.now()}.ark`;
  await RNFS.copyFile(encryptedFileUri, tempPath);
  console.log('✅ Copied .ark to temp:', tempPath);
  cleanUri = tempPath;
} else {
  cleanUri = encryptedFileUri.replace('file://', '');
}

    // Read only the metadata portion first (first 500 bytes is enough)
    // The metadata is at the start of the file before the chunks array
    const fileSize = (await RNFS.stat(cleanUri)).size;
    console.log(`📊 .ark file size: ${fileSize} bytes`);

    // Read first 2KB to extract metadata
    const headerRaw = await RNFS.read(cleanUri, 2000, 0, 'utf8');
    
    // Extract metadata JSON before the chunks array starts
    const metaMatch = headerRaw.match(/"metadata":(\{[^}]+\})/);
    if (!metaMatch) throw new Error('Could not parse metadata from .ark file');
    
    const metadata = JSON.parse(metaMatch[1]);
    const numChunks = metadata.numChunks;
    const originalName = metadata.originalName;

    console.log(`📦 Decrypting ${numChunks} chunks for: ${originalName}`);

    const outputPath = `${RNFS.DocumentDirectoryPath}/decrypted_${originalName}`;
    const exists = await RNFS.exists(outputPath);
    if (exists) await RNFS.unlink(outputPath);

    // Read the full file as text but parse chunks one at a time
    // We do this by finding each chunk string boundary manually
    // Read in 2MB text windows and extract complete chunks
    
    const READ_WINDOW = 2 * 1024 * 1024; // 2MB read window
    let byteOffset = 0;
    let buffer = '';
    let chunksDecrypted = 0;
    let inChunksArray = false;

    // Skip past the metadata to the chunks array
    const chunksStart = headerRaw.indexOf('"chunks":[');
    if (chunksStart === -1) throw new Error('Could not find chunks array');
    
    // Start reading from where chunks array begins
    byteOffset = chunksStart + '"chunks":['.length;
    buffer = '';

    while (chunksDecrypted < numChunks) {
      // Read next window of bytes
      const bytesToRead = Math.min(READ_WINDOW, fileSize - byteOffset);
      if (bytesToRead <= 0 && buffer.trim().length === 0) break;

      if (bytesToRead > 0) {
        const newData = await RNFS.read(cleanUri, bytesToRead, byteOffset, 'utf8');
        byteOffset += bytesToRead;
        buffer += newData;
      }

      // Extract complete JSON strings from buffer
      // Each chunk is a JSON string: "U2FsdGVkX1..." 
      while (buffer.length > 0) {
        // Skip commas and whitespace between chunks
        buffer = buffer.replace(/^[,\s\]]+/, match => {
          // If we hit ] it's the end of the array
          if (match.includes(']')) buffer = '';
          return '';
        });

        if (buffer.length === 0) break;

        // Find the complete JSON string (starts and ends with ")
        if (buffer[0] !== '"') break;

        // Find the closing quote (not escaped)
        let end = -1;
        for (let i = 1; i < buffer.length; i++) {
          if (buffer[i] === '"' && buffer[i-1] !== '\\') {
            end = i;
            break;
          }
        }

        if (end === -1) {
          // Incomplete chunk string — need more data
          break;
        }

        // Extract the encrypted chunk string
        const encryptedChunk = buffer.substring(1, end);
        buffer = buffer.substring(end + 1);

        // Decrypt this chunk
        const decryptedBytes = CryptoJS.AES.decrypt(encryptedChunk, key);
        const decryptedChunk = decryptedBytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedChunk) {
          throw new Error(`Chunk ${chunksDecrypted + 1} failed — wrong key or corrupted`);
        }

        // Write chunk to output file immediately
        await RNFS.appendFile(outputPath, decryptedChunk, 'base64');

        chunksDecrypted++;
        const percent = Math.round((chunksDecrypted / numChunks) * 100);
        onProgress?.(percent);
        console.log(`✅ Decrypted chunk ${chunksDecrypted}/${numChunks} (${percent}%)`);
      }
    }

    console.log('✅ Decrypted file saved:', outputPath);
    return { path: outputPath, originalName };

  } catch (error) {
    console.error('❌ Decryption error:', error);
    throw error;
  }
};