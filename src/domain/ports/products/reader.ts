import { Product } from '../../product'

export interface ProductReader {
  getById(id: string): Product | null | Promise<Product | null>
}

