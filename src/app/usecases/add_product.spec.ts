import { MemoryProductsGateway } from 'src/adapters/gateways/memory_products'
import { AddProduct } from 'src/app/usecases/add_product'
import { GetProduct } from 'src/app/usecases/get_product'

// Étape 2 — Implémentez AddProduct et GetProduct
// Pour activer cette étape: remplacez describe.skip par describe.
describe.skip('Étape 2 — Use cases Add/Get', () => {
  it('ajoute un produit et le retrouve', async () => {
    const repository = new MemoryProductsGateway()
    const addProduct = new AddProduct(repository)
    const getProduct = new GetProduct(repository)

    await addProduct.exec({ id: 'p1', name: 'Pen', stock: 5 })
    const foundProduct = await getProduct.exec('p1')

    expect(foundProduct?.name).toBe('Pen')
    expect(foundProduct?.stock).toBe(5)
  })

  it('rejette un produit invalide', async () => {
    const repository = new MemoryProductsGateway()
    const addProduct = new AddProduct(repository)

    await expect(addProduct.exec({ id: '', name: 'X', stock: 0 })).rejects.toThrow('invalid_product')
    await expect(addProduct.exec({ id: 'p', name: '', stock: 0 })).rejects.toThrow('invalid_product')
    await expect(addProduct.exec({ id: 'p', name: 'X', stock: -1 })).rejects.toThrow('invalid_stock')
  })
})
