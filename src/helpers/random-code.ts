import { randomBytes } from 'crypto';

export function generateRandomCode(length: number) {
  const buffer = randomBytes(length);

  let code = '';
  for (let i = 0; i < length; i++) {
    const digit = buffer[i] % 10;
    code += digit.toString();
  }

  return code;
}
