import { AddProduct } from '../../app/usecases/add_product'
import { BuyProduct } from '../../app/usecases/buy_product'
import { GetProduct } from '../../app/usecases/get_product'
import { SearchProducts } from '../../app/usecases/search_products'

type StatusBody = { status: number, body: unknown }

// Étape 4 — À implémenter: mapping entre erreurs métier et codes HTTP
// Indices dans src/adapters/controllers/products_controller.spec.ts
function errorToStatus(error: unknown): number {
  if (!(error instanceof Error)) return 500

  switch (error.message) {
    case 'invalid_product':
    case 'invalid_stock':
    case 'invalid_qty':
      return 400
    case 'not_found':
      return 404
    case 'insufficient_stock':
      return 409
    default:
      return 500
  }
}

export function buildProductsController(dependences: {
  addProduct: AddProduct
  getProduct: GetProduct
  buyProduct: BuyProduct
  searchProducts: SearchProducts
}) {
  return {
    async add(body: any): Promise<StatusBody> {
      try {
        const { id, name, stock } = body
        await dependences.addProduct.exec({ id, name, stock })
        return { status: 201, body: { id, name, stock } }
      } catch (error) {
        return {
          status: errorToStatus(error),
          body: { error: (error as Error).message },
        }
      }
    },

    async get(id: string): Promise<StatusBody> {
      const product = await dependences.getProduct.exec(id)
      if (!product) {
        return { status: 404, body: { error: 'not_found' } }
      }
      return { status: 200, body: product }
    },

    async buy(id: string, body: any): Promise<StatusBody> {
      try {
        const { quantity } = body
        const updatedProduct = await dependences.buyProduct.exec(id, quantity)
        return { status: 200, body: updatedProduct }
      } catch (error) {
        return {
          status: errorToStatus(error),
          body: { error: (error as Error).message },
        }
      }
    },

    async search(query: string, limit?: number): Promise<StatusBody> {
      try {
        const products = await dependences.searchProducts.exec(query, limit)
        return { status: 200, body: products }
      } catch {
        return { status: 500, body: { error: 'fetch_failed' } }
      }
    },
  }
}
