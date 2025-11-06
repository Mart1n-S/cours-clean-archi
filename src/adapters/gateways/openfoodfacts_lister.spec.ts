import { OpenFoodFactsLister } from 'src/adapters/gateways/openfoodfacts_lister'

// Étape 6 — OpenFoodFactsLister
// API (référence):
//  https://world.openfoodfacts.org/cgi/search.pl?search_terms=<query>&search_simple=1&action=process&json=1&page_size=<limit>
// Mapping attendu (→ Product): id=code/_id, name=product_name/generic_name/brands, stock=0
// En test, fetch est mocké → pas de réseau nécessaire
// Pour activer cette étape: remplacez describe.skip par describe.
describe.skip('Étape 6 — OpenFoodFactsLister', () => {
  const realFetch = (global as any).fetch

  afterEach(() => {
    ;(global as any).fetch = realFetch
  })

  it('maps products from API response', async () => {
    ;(global as any).fetch = jest.fn(async () => ({ ok: true, json: async () => ({ products: [ { code: '123', product_name: 'Bar' }, { code: '0', product_name: '' } ] }) }))
    const lister = new OpenFoodFactsLister()
    const items = await lister.list('bar', 2)
    expect(Array.isArray(items)).toBe(true)
    expect(items[0].id).toBe('123')
    expect(items[0].name.length).toBeGreaterThan(0)
  })
})
