import { promises as fs } from 'fs'
import path from 'path'

export type AppConfig = {
  storeFile: string
}

const DEFAULT_STORE = 'data/products.json'
const DEFAULT_CONFIG_PATHS = [
  process.env.APP_CONFIG,
  'config/mini-inventory.json',
  'config/app.json',
  'config.json'
].filter(Boolean) as string[]

async function tryReadJson<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(raw) as T
  } catch (error) {
    return null
  }
}

export async function loadConfig(cwd: string = process.cwd()): Promise<AppConfig> {
  const envStore = process.env.STORE_FILE
  if (envStore && envStore.trim() !== '') {
    return { storeFile: path.resolve(cwd, envStore) }
  }

  for (const configPath of DEFAULT_CONFIG_PATHS) {
    const absolutePath = path.resolve(cwd, configPath)
    const json = await tryReadJson<Partial<AppConfig>>(absolutePath)
    if (json && typeof json.storeFile === 'string' && json.storeFile.trim() !== '') {
      return { storeFile: path.resolve(cwd, json.storeFile) }
    }
  }

  return { storeFile: path.resolve(cwd, DEFAULT_STORE) }
}
