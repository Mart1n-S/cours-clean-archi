import { Product } from '../../domain/product'
import { ProductLister } from '../../domain/ports/products/lister'

// Étape 4 — À implémenter: déléguer à ProductLister
export class SearchProducts {
  constructor(private lister: ProductLister) {}

  async exec(_query: string, _limit?: number): Promise<Product[]> {
    throw new Error('TODO Etape 4: SearchProducts.exec')
  }
}
