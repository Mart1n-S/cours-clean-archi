import { Product } from '../../domain/product'
import { ProductLister } from '../../domain/ports/products/lister'

// Étape 4 — À implémenter: déléguer à ProductLister
export class SearchProducts {
  constructor(private lister: ProductLister) { }

  async exec(query: string, limit?: number): Promise<Product[]> {
    return await this.lister.list(query, limit)
  }
}
