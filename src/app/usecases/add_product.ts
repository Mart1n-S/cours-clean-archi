import { Product } from '../../domain/product'
import { ProductWriter } from '../../domain/ports/products/writer'

// Étape 2 — À implémenter: validation et sauvegarde via le port ProductWriter
export class AddProduct {
  constructor(private writer: ProductWriter) { }

  async exec(p: Product): Promise<void> {
    if (!p.id || !p.name) {
      throw new Error('invalid_product')
    }
    if (p.stock < 0) {
      throw new Error('invalid_stock')
    }

    await this.writer.save(p)
  }
}
