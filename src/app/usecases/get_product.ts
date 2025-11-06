import { Product } from '../../domain/product'
import { ProductReader } from '../../domain/ports/products/reader'

// Étape 2 — À implémenter: lecture via le port ProductReader
export class GetProduct {
  constructor(private reader: ProductReader) { }

  async exec(id: string): Promise<Product | null> {
    return await this.reader.getById(id)
  }
}
