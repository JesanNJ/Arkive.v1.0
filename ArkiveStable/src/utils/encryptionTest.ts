import RNFS from 'react-native-fs';
import {
  generateAndStoreKey,
  getKey,
  encryptFileData,
  decryptFileData,
} from '../services/encryptionService';

import {
  saveEncryptedFile,
  readEncryptedFile,
} from '../services/fileService';

export const runEncryptionTest = async (file: any) => {
  try {
    console.log('🚀 START TEST');

    // 🔑 Key
    const key = await generateAndStoreKey();
    console.log('🔑 KEY:', key);

    // 📁 Read file
    const base64Data = await RNFS.readFile(file.uri, 'base64');

    // 🔐 Encrypt
    const encrypted = await encryptFileData(base64Data, key, file);

    // 💾 Save .ark
    const path = await saveEncryptedFile(encrypted, file.name);
    console.log('💾 SAVED:', path);

    // 📦 Read back
    const saved = await readEncryptedFile(path);

    // 🔓 Decrypt
    const keyAgain = await getKey();
    const decrypted = await decryptFileData(saved, keyAgain);

    // 🧪 Restore file
    const outputPath = `${RNFS.DocumentDirectoryPath}/restored_${file.name}`;
    await RNFS.writeFile(outputPath, decrypted, 'base64');

    console.log('✅ RESTORED:', outputPath);
    console.log('🎉 TEST SUCCESS');

  } catch (err) {
    console.log('❌ TEST FAILED:', err);
  }
};