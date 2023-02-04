import Cryptr from 'cryptr';

const { APP_SECRET, APP_ENC_KEY } = process.env;

const cryptr = new Cryptr(APP_SECRET);
export const DATA_ENCRYPTION_KEY = cryptr.encrypt(APP_ENC_KEY);

export const generateEncryptionKey = (data: string) => {
  const cryptr = new Cryptr(`${APP_SECRET}${DATA_ENCRYPTION_KEY}${APP_ENC_KEY}`);
  return cryptr.encrypt(data);
};