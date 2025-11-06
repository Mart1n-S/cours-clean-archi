import { AddProduct } from '../../app/usecases/add_product'
import { BuyProduct } from '../../app/usecases/buy_product'
import { GetProduct } from '../../app/usecases/get_product'
import { SearchProducts } from '../../app/usecases/search_products'

type StatusBody = { status: number, body: unknown }

// Étape 4 — À implémenter: mapping entre erreurs métier et codes HTTP
// Indices dans src/adapters/controllers/products_controller.spec.ts
function errorToStatus(_err: unknown): number {
  throw new Error('TODO Etape 4: errorToStatus')
}

export function buildProductsController(_deps: {
  addProduct: AddProduct
  getProduct: GetProduct
  buyProduct: BuyProduct
  searchProducts: SearchProducts
}) {
  return {
    async add(_body: any): Promise<StatusBody> {
      throw new Error('TODO Etape 4: controller.add')
    },
    async get(_id: string): Promise<StatusBody> {
      throw new Error('TODO Etape 4: controller.get')
    },
    async buy(_id: string, _body: any): Promise<StatusBody> {
      throw new Error('TODO Etape 4: controller.buy')
    },
    async search(_query: string, _limit?: number): Promise<StatusBody> {
      throw new Error('TODO Etape 4: controller.search')
    }
  }
}
