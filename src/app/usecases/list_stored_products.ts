import { Product } from '../../domain/product'
import { ProductReaderAll } from '../../domain/ports/products/list_all'

// Étape 3 — À implémenter: lister tous les produits via ProductReaderAll
export class ListStoredProducts {
  constructor(private reader: ProductReaderAll) {}

  async exec(): Promise<Product[]> {
    throw new Error('TODO Etape 3: ListStoredProducts.exec')
  }
}
