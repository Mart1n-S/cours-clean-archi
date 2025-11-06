import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'
import { loadConfig } from 'src/frameworks/config/config'

async function tmpDir() {
  return await fs.mkdtemp(path.join(os.tmpdir(), 'cfg-'))
}

// Étape 7 — chargeur de config
// Pour activer cette étape: remplacez describe.skip par describe.
describe('Étape 7 — config loader', () => {
  it('prefers env var over file and default', async () => {
    const dir = await tmpDir()
    await fs.mkdir(path.join(dir, 'config'))
    await fs.writeFile(path.join(dir, 'config', 'mini-inventory.json'), JSON.stringify({ storeFile: 'data/a.json' }), 'utf-8')
    process.env.STORE_FILE = 'env/override.json'
    const cfg = await loadConfig(dir)
    expect(cfg.storeFile.endsWith(path.normalize('env/override.json'))).toBe(true)
    delete process.env.STORE_FILE
  })

  it('reads from default config path if present', async () => {
    const dir = await tmpDir()
    await fs.mkdir(path.join(dir, 'config'))
    await fs.writeFile(path.join(dir, 'config', 'mini-inventory.json'), JSON.stringify({ storeFile: 'data/b.json' }), 'utf-8')
    const cfg = await loadConfig(dir)
    expect(cfg.storeFile.endsWith(path.normalize('data/b.json'))).toBe(true)
  })

  it('falls back to default path when none set', async () => {
    const dir = await tmpDir()
    const cfg = await loadConfig(dir)
    expect(cfg.storeFile.endsWith(path.normalize('data/products.json'))).toBe(true)
  })
})
