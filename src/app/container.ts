import { MemoryProductsGateway } from '../adapters/gateways/memory_products'
import { FileRepo } from '../frameworks/db/file_repo'
import { OpenFoodFactsLister } from '../adapters/gateways/openfoodfacts_lister'
import { AddProduct } from './usecases/add_product'
import { BuyProduct } from './usecases/buy_product'
import { GetProduct } from './usecases/get_product'
import { SearchProducts } from './usecases/search_products'
import { ListStoredProducts } from './usecases/list_stored_products'
import type { ProductsRepository } from '../domain/ports/products/repository'

export function buildContainer(opts?: { storeFile?: string }) {
  const storeFile = opts?.storeFile ?? process.env.STORE_FILE
  let productsRepository: ProductsRepository
  if (storeFile) productsRepository = new FileRepo(storeFile)
  else productsRepository = new MemoryProductsGateway()
  const openFoodFactsLister = new OpenFoodFactsLister()
  return {
    addProduct: new AddProduct(productsRepository),
    buyProduct: new BuyProduct(productsRepository, productsRepository),
    getProduct: new GetProduct(productsRepository),
    searchProducts: new SearchProducts(openFoodFactsLister),
    listStoredProducts: new ListStoredProducts(productsRepository)
  }
}
