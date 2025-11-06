import { promises as fs } from 'fs'
import path from 'path'
import { Product } from '../../domain/product'
import { ProductReader } from '../../domain/ports/products/reader'
import { ProductWriter } from '../../domain/ports/products/writer'
import { ProductReaderAll } from '../../domain/ports/products/list_all'

type StoreShape = Record<string, Product>

// Étape 5 — À implémenter: persistance fichier (JSON) + rechargement
// Voir src/frameworks/db/file_repo.spec.ts pour les attentes.
export class FileRepo implements ProductReader, ProductWriter, ProductReaderAll {
  // À implémenter — conseils:
  // - Utilisez une Map<string, Product> en cache pour les lectures/écritures.
  // - Chargez le cache à la première opération (lazy) via `load()`.
  // - Persistez le JSON sur disque à chaque `save()` via `persist()`.
  // - Forme du fichier JSON: un objet { [id]: Product } (cf. StoreShape).
  // - Sérialisez avec JSON.stringify(obj, null, 2) pour lisibilité.
  // - Si le fichier n'existe pas (ENOENT) → base vide.
  // - Si le JSON est invalide → base vide (pas d'exception propagée).
  // - Filtrez les entrées invalides lors du chargement (id/name/stock cohérents).
  // private db: Map<string, Product> = new Map()
  // private loaded = false

  constructor(private filePath: string) {}

  private async load() {
    // Étapes suggérées:
    // 1) si déjà chargé → return
    // 2) lire le fichier (fs.readFile) en 'utf-8'
    // 3) JSON.parse → StoreShape
    // 4) pour chaque entrée valide → this.db.set(id, product)
    // 5) en cas d'erreur (ENOENT, JSON invalide) → démarrer avec une Map vide
    throw new Error('TODO Etape 5: FileRepo.load')
  }

  private async persist() {
    // Étapes suggérées:
    // 1) s'assurer que le dossier existe: fs.mkdir(path.dirname(filePath), { recursive: true })
    // 2) construire un objet StoreShape à partir de this.db
    // 3) écrire le JSON (indentation 2 espaces) avec fs.writeFile
    throw new Error('TODO Etape 5: FileRepo.persist')
  }

  async getById(_id: string): Promise<Product | null> {
    // 1) await this.load()
    // 2) return this.db.get(id) ?? null
    throw new Error('TODO Etape 5: FileRepo.getById')
  }

  async save(_product: Product): Promise<void> {
    // 1) await this.load()
    // 2) this.db.set(product.id, product)
    // 3) await this.persist()
    throw new Error('TODO Etape 5: FileRepo.save')
  }

  async listAll(): Promise<Product[]> {
    // 1) await this.load()
    // 2) return Array.from(this.db.values())
    throw new Error('TODO Etape 5: FileRepo.listAll')
  }
}
