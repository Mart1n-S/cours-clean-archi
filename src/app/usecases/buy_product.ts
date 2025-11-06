import { Product } from '../../domain/product'
import { ProductReader } from '../../domain/ports/products/reader'
import { ProductWriter } from '../../domain/ports/products/writer'

// Étape 3 — À implémenter: validations + mise à jour du stock
export class BuyProduct {
  constructor(private reader: ProductReader, private writer: ProductWriter) {}

  async exec(_id: string, _qty: number): Promise<Product> {
    throw new Error('TODO Etape 3: BuyProduct.exec')
  }
}
