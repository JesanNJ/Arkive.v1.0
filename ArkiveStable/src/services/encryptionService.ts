import CryptoJS from 'crypto-js';
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_ALIAS = 'arkive_master_key';

// 🔑 Generate key
export const generateAndStoreKey = async (): Promise<string> => {
  try {
    // Check if key already exists
    let key = await AsyncStorage.getItem('encryptionKey');
    
    if (key) {
      console.log('✅ Using existing encryption key');
      return key;
    }
    
    // Generate new key
    key = CryptoJS.lib.WordArray.random(32).toString();
    
    // Store it
    await AsyncStorage.setItem('encryptionKey', key);
    console.log('✅ Generated and stored new encryption key');
    
    return key;
  } catch (error) {
    console.error('❌ Error generating/storing key:', error);
    throw error;
  }
};

/**
 * Get the stored encryption key
 */
export const getStoredKey = async (): Promise<string | null> => {
  try {
    const key = await AsyncStorage.getItem('encryptionKey');
    
    if (!key) {
      console.log('⚠️ No encryption key found in storage');
      return null;
    }
    
    console.log('✅ Retrieved encryption key from storage');
    return key;
  } catch (error) {
    console.error('❌ Error getting stored key:', error);
    return null;
  }
};

// 🔑 Get key
export const getKey = async () => {
  const creds = await Keychain.getGenericPassword();
  if (!creds) throw new Error('Key not found');

  return creds.password;
};

// 🔐 Encrypt
export const encryptFileData = async (
  base64Data: string,
  key: string,
  meta: any
) => {
  const encrypted = CryptoJS.AES.encrypt(base64Data, key).toString();

  return {
    data: encrypted,
    meta,
  };
};

// 🔓 Decrypt
export const decryptFileData = async (
  payload: any,
  key: string
) => {
  const bytes = CryptoJS.AES.decrypt(payload.data, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};