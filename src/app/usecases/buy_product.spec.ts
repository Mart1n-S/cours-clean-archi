import { MemoryProductsGateway } from 'src/adapters/gateways/memory_products'
import { AddProduct } from 'src/app/usecases/add_product'
import { BuyProduct } from 'src/app/usecases/buy_product'

// Étape 3 — Implémentez BuyProduct
// Pour activer cette étape: remplacez describe.skip par describe.
describe.skip('Étape 3 — BuyProduct', () => {
  it('diminue le stock', async () => {
    const repository = new MemoryProductsGateway()
    const addProduct = new AddProduct(repository)
    const buyProduct = new BuyProduct(repository, repository)

    await addProduct.exec({ id: 'p1', name: 'Pen', stock: 5 })
    const updatedProduct = await buyProduct.exec('p1', 3)

    expect(updatedProduct.stock).toBe(2)
  })

  it('refuse quantités invalides et stock insuffisant', async () => {
    const repository = new MemoryProductsGateway()
    const addProduct = new AddProduct(repository)
    const buyProduct = new BuyProduct(repository, repository)

    await addProduct.exec({ id: 'p1', name: 'Pen', stock: 2 })
    await expect(buyProduct.exec('p1', 0)).rejects.toThrow('invalid_qty')
    await expect(buyProduct.exec('p1', -1)).rejects.toThrow('invalid_qty')
    await expect(buyProduct.exec('p1', 3)).rejects.toThrow('insufficient_stock')
  })

  it('signale produit introuvable', async () => {
    const repository = new MemoryProductsGateway()
    const buyProduct = new BuyProduct(repository, repository)
    await expect(buyProduct.exec('missing', 1)).rejects.toThrow('not_found')
  })
})
