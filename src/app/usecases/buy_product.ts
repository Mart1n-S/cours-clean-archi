import { Product } from '../../domain/product'
import { ProductReader } from '../../domain/ports/products/reader'
import { ProductWriter } from '../../domain/ports/products/writer'

// Étape 3 — À implémenter: validations + mise à jour du stock
export class BuyProduct {
  constructor(private reader: ProductReader, private writer: ProductWriter) { }

  async exec(id: string, quantity: number): Promise<Product> {
    if (quantity <= 0) {
      throw new Error('invalid_qty')
    }

    const product = await this.reader.getById(id)
    if (!product) {
      throw new Error('not_found')
    }

    if (product.stock < quantity) {
      throw new Error('insufficient_stock')
    }

    const updated: Product = {
      ...product,
      stock: product.stock - quantity,
    }

    await this.writer.save(updated)
    return updated
  }
}
