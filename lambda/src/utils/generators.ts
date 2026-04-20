import { randomBytes } from 'crypto';

export function generateApplicationId(): string {
  const timestamp = Date.now();
  const random = randomBytes(4).toString('hex');
  return `APP_${timestamp}_${random}`;
}

export function isValidApplicationId(id: string): boolean {
  return /^APP_\d+_[a-f0-9]{8}$/.test(id);
}

export function generateRequestId(): string {
  const timestamp = Date.now();
  const random = randomBytes(4).toString('hex');
  return `REQ_${timestamp}_${random}`;
}

export function extractTimestampFromId(id: string): Date | null {
  const match = id.match(/^(?:APP|REQ)_(\d+)_/);
  if (match && match[1]) {
    return new Date(parseInt(match[1], 10));
  }
  return null;
}