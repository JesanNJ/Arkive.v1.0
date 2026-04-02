import CryptoJS from 'crypto-js';
import * as Keychain from 'react-native-keychain';

const KEY_ALIAS = 'arkive_master_key';

// 🔑 Generate key
export const generateAndStoreKey = async () => {
  const existing = await Keychain.getGenericPassword();

  if (existing) return existing.password;

  const key = CryptoJS.lib.WordArray.random(32).toString();

  await Keychain.setGenericPassword(KEY_ALIAS, key);

  return key;
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