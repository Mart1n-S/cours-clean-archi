import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'
import { FileRepo } from 'src/frameworks/db/file_repo'

function tmpFile() {
  const dir = fs.mkdtemp(path.join(os.tmpdir(), 'inv-'))
  return dir.then(d => path.join(d, 'store.json'))
}

// Étape 5 — Implémentez FileRepo (persistant)
// Attendus:
// - Sauvegarder sur disque à chaque save() (JSON { [id]: Product })
// - Recharger depuis le disque à la première lecture (lazy load)
// - Fichier absent → base vide (pas d'exception)
// - JSON invalide → base vide (pas d'exception)
// - listAll() retourne le contenu en mémoire
// Indices d'implémentation dans src/frameworks/db/file_repo.ts
// Pour activer cette étape: remplacez describe.skip par describe.
describe('Étape 5 — FileRepo', () => {
  it('persists on each save and reloads', async () => {
    const file = await tmpFile()
    const repo1 = new FileRepo(file)
    await repo1.save({ id: 'x', name: 'Box', stock: 2 })
    const read1 = await repo1.getById('x')
    expect(read1?.name).toBe('Box')

    const repo2 = new FileRepo(file)
    const read2 = await repo2.getById('x')
    expect(read2?.stock).toBe(2)
    const json = JSON.parse(await fs.readFile(file, 'utf-8'))
    expect(json.x.name).toBe('Box')
  })
})
