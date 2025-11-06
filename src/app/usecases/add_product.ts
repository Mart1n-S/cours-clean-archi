import { Product } from '../../domain/product'
import { ProductWriter } from '../../domain/ports/products/writer'

// Étape 2 — À implémenter: validation et sauvegarde via le port ProductWriter
export class AddProduct {
  constructor(private writer: ProductWriter) {}

  async exec(_p: Product): Promise<void> {
    throw new Error('TODO Etape 2: AddProduct.exec')
  }
}
