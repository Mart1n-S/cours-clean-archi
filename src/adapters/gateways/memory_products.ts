import { Product } from '../../domain/product'
import { ProductReader } from '../../domain/ports/products/reader'
import { ProductWriter } from '../../domain/ports/products/writer'
import { ProductReaderAll } from '../../domain/ports/products/list_all'

// Étape 1 — À implémenter par les étudiants
// Objectif: déposer en mémoire (Map) pour lire/écrire/lister des produits.
// Voir les attentes dans: src/adapters/gateways/memory_products.spec.ts
export class MemoryProductsGateway implements ProductReader, ProductWriter, ProductReaderAll {
  // Suggestion: utilisez une Map<string, Product>
  private storage: Map<string, Product> = new Map()

  getById(id: string): Product | null {
    return this.storage.get(id) ?? null
  }

  save(product: Product): void {
    this.storage.set((product as any).id, product)
  }

  listAll(): Product[] {
    return Array.from(this.storage.values())
  }
}
