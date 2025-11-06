import { buildProductsController } from 'src/adapters/controllers/products_controller'

class OkUseCases {
  async exec(_: any, __?: any): Promise<any> { }
}

// Étape 4 — Controller
// Implémentez buildProductsController avec les attentes suivantes:
// - add(body): parse {id,name,stock}, 201 si ok; erreurs 'invalid_product'/'invalid_stock' -> 400; sinon 500
// - get(id): 200 avec le produit si trouvé, 404 sinon
// - buy(id, body): parse {quantity}; erreurs 'invalid_qty' -> 400, 'insufficient_stock' -> 409, 'not_found' -> 404
// - search(query, limit): délègue au use case; 200 si ok; 500 en cas d’erreur
// Pour activer cette étape: remplacez describe.skip par describe.
describe('Étape 4 — ProductsController', () => {
  it('maps add errors to http statuses', async () => {
    const addProduct = { exec: async () => { throw new Error('invalid_product') } } as any
    const controller = buildProductsController({ addProduct, getProduct: new OkUseCases() as any, buyProduct: new OkUseCases() as any, searchProducts: new OkUseCases() as any })
    const result = await controller.add({})
    expect(result.status).toBe(400)
    expect(result.body).toEqual({ error: 'invalid_product' })
  })

  it('maps buy errors to http statuses', async () => {
    const buyProduct = { exec: async () => { throw new Error('insufficient_stock') } } as any
    const controller = buildProductsController({ addProduct: new OkUseCases() as any, getProduct: new OkUseCases() as any, buyProduct, searchProducts: new OkUseCases() as any })
    const result = await controller.buy('x', { qty: 10 })
    expect(result.status).toBe(409)
  })

  it('maps unknown add error to 500', async () => {
    const addProduct = { exec: async () => { throw new Error('weird') } } as any
    const controller = buildProductsController({ addProduct, getProduct: new OkUseCases() as any, buyProduct: new OkUseCases() as any, searchProducts: new OkUseCases() as any })
    const result = await controller.add({})
    expect(result.status).toBe(500)
    expect(result.body).toEqual({ error: 'weird' })
  })

  it('search returns 500 on failure', async () => {
    const searchProducts = { exec: async () => { throw new Error('offline') } } as any
    const controller = buildProductsController({ addProduct: new OkUseCases() as any, getProduct: new OkUseCases() as any, buyProduct: new OkUseCases() as any, searchProducts })
    const result = await controller.search('q', 1)
    expect(result.status).toBe(500)
  })
})
