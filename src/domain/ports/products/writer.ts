import { Product } from '../../product'

export interface ProductWriter {
  save(product: Product): void | Promise<void>
}

