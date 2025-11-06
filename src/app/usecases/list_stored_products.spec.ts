import { Product } from 'src/domain/product'
import { ListStoredProducts } from 'src/app/usecases/list_stored_products'
import { ProductReaderAll } from 'src/domain/ports/products/list_all'

class FakeRepo implements ProductReaderAll {
  private data: Product[] = [
    { id: 'l1', name: 'Lamp', stock: 1 },
    { id: 'l2', name: 'Lead', stock: 2 }
  ]
  listAll(): Product[] | Promise<Product[]> {
    return this.data
  }
}

// Étape 3 — Implémentez ListStoredProducts
// Pour activer cette étape: remplacez describe.skip par describe.
describe.skip('Étape 3 — ListStoredProducts', () => {
  it('lists products from repository', async () => {
    const useCase = new ListStoredProducts(new FakeRepo())
    const result = await useCase.exec()
    expect(result.length).toBe(2)
    expect(result[0].id).toBe('l1')
  })
})
