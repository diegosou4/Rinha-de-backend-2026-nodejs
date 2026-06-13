import { readFile } from 'node:fs/promises'
import { gunzipSync } from 'node:zlib'
import { References } from './interface/references.js'

export const loadJson = async <T = unknown>(path: string): Promise<T> => {
  const content = await readFile(path, 'utf8')
  return JSON.parse(content) as T
}

export const loadReferences = async (path: string): Promise<References> => {
  const file = await readFile(path)
  const content = path.endsWith('.gz') ? gunzipSync(file) : file

  return JSON.parse(content.toString()) as References
}
