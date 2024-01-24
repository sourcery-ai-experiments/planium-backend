import { randomUUID } from 'crypto';
import { extname } from 'path';

export const renameFile = (originalName: string): string => {
  const fileExtName = extname(originalName);
  const randomName = randomUUID();

  return `${randomName}${fileExtName}`;
};
