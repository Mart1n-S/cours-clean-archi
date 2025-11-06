import { Product } from 'src/domain/product'
import { ProductReader } from 'src/domain/ports/products/reader'
import { ProductWriter } from 'src/domain/ports/products/writer'
import { AddProduct } from 'src/app/usecases/add_product'
import { GetProduct } from 'src/app/usecases/get_product'

class OtherRepo implements ProductReader, ProductWriter {
  private store: Record<string, Product> = {}
  getById(id: string): Product | null {
    return this.store[id] ?? null
  }
  save(product: Product): void {
    this.store[product.id] = product
  }
}

// Étape 2 — Vérifier la substitution de dépôt (DIP)
// Pour activer cette étape: remplacez describe.skip par describe.
describe('Étape 2 — Substitution de dépôt', () => {
  it('fonctionne avec une autre implémentation', async () => {
    const repository = new OtherRepo()
    const addProduct = new AddProduct(repository)
    const getProduct = new GetProduct(repository)

    await addProduct.exec({ id: 'x', name: 'Box', stock: 1 })
    const foundProduct = await getProduct.exec('x')

    expect(foundProduct?.name).toBe('Box')
  })
})
