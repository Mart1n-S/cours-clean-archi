import { Product } from '../../product'

export interface ProductReaderAll {
  listAll(): Product[] | Promise<Product[]>
}

