import fs from 'fs/promises';
import path from 'path';

export const readJsonFile = async <T>(filePath: string): Promise<T> => {
  const data = await fs.readFile(path.resolve(filePath), 'utf-8');
  return JSON.parse(data);
};

export const writeJsonFile = async (
  filePath: string,
  data: unknown
): Promise<void> => {
  await fs.writeFile(
    path.resolve(filePath),
    JSON.stringify(data, null, 2)
  );
};