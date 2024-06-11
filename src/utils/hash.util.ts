import * as crypto from 'crypto';

export function hash(value: string) {
  const hash = crypto.createHash('sha256');
  hash.update(value);
  return hash.digest('hex');
}

export function compare(value: string, hashedData: string) {
  const hashValue = hash(value);
  if (hashValue === hashedData) {
    return true;
  } else {
    return false;
  }
}
