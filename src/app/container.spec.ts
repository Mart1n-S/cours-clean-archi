import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'
import { buildContainer } from 'src/app/container'

function tmpFile() {
  return fs.mkdtemp(path.join(os.tmpdir(), 'inv-')).then(d => path.join(d, 'store.json'))
}

// Étape 7 — câblage container (persistance fichier)
// Pour activer cette étape: remplacez describe.skip par describe.
describe('Étape 7 — container wiring', () => {
  it('persiste dans le fichier passé au container', async () => {
    const filePath = await tmpFile()
    const container = buildContainer({ storeFile: filePath })
    await container.addProduct.exec({ id: 'cx', name: 'Cont', stock: 2 })
    const json = JSON.parse(await fs.readFile(filePath, 'utf-8'))
    expect(json.cx.name).toBe('Cont')
  })
})
