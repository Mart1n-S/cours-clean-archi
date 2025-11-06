import { Product } from '../../product'

export interface ProductLister {
  list(query: string, limit?: number): Promise<Product[]>
}

