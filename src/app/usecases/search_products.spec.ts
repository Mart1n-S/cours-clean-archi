import { Product } from 'src/domain/product'
import { SearchProducts } from 'src/app/usecases/search_products'

class FakeLister {
  async list(query: string, limit?: number): Promise<Product[]> {
    const base: Product[] = [
      { id: 'a', name: 'Alpha', stock: 0 },
      { id: 'b', name: 'Beta', stock: 0 },
      { id: 'g', name: 'Gamma', stock: 0 }
    ]
    const filtered = base.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    return typeof limit === 'number' ? filtered.slice(0, limit) : filtered
  }
}

// Étape 4 — SearchProducts
// Pour activer cette étape de l'exercice: remplacez describe.skip par describe.
describe.skip('Étape 4 — SearchProducts', () => {
  it('returns filtered list from lister port', async () => {
    const useCase = new SearchProducts(new FakeLister() as any)
    const result = await useCase.exec('a')
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(product => product.name.toLowerCase().includes('a'))).toBe(true)
  })
})
