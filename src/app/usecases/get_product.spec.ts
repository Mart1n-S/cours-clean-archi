import { MemoryProductsGateway } from 'src/adapters/gateways/memory_products'
import { AddProduct } from 'src/app/usecases/add_product'
import { GetProduct } from 'src/app/usecases/get_product'

// Étape 2 — Implémentez GetProduct (et AddProduct pour préparer les données)
// Pour activer cette étape: remplacez describe.skip par describe.
describe('Étape 2 — GetProduct', () => {
  it('retourne null si absent', async () => {
    const repository = new MemoryProductsGateway()
    const getProduct = new GetProduct(repository)
    const result = await getProduct.exec('none')
    expect(result).toBeNull()
  })

  it('retourne le produit', async () => {
    const repository = new MemoryProductsGateway()
    const addProduct = new AddProduct(repository)
    const getProduct = new GetProduct(repository)

    await addProduct.exec({ id: 'p1', name: 'Pen', stock: 2 })
    const result = await getProduct.exec('p1')
    expect(result?.id).toBe('p1')
    expect(result?.stock).toBe(2)
  })
})
