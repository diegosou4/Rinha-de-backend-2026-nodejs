import { readFile } from 'node:fs/promises'
import { gunzipSync } from 'node:zlib'
import { createReadStream } from 'fs';
import { createGunzip } from 'zlib';

export type References = Float32Array;
export const loadJson = async <T = unknown>(path: string): Promise<T> => {
  const content = await readFile(path, 'utf8')
  return JSON.parse(content) as T
}




// Explorar o uso do Float 32 ou 16Array para otimizar a memoria
// export async function loadReferences(path: string): Promise<References> {
