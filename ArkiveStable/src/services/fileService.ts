import RNFS from 'react-native-fs';

export const saveEncryptedFile = async (data: any, name: string) => {
  const path = `${RNFS.DocumentDirectoryPath}/${name}.ark`;

  await RNFS.writeFile(path, JSON.stringify(data), 'utf8');

  return path;
};

export const readEncryptedFile = async (path: string) => {
  const content = await RNFS.readFile(path, 'utf8');
  return JSON.parse(content);
};