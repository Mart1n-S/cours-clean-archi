import { Product } from '../../domain/product'
import { ProductLister } from '../../domain/ports/products/lister'

// Étape 6 — À implémenter: appeler OpenFoodFacts et mapper les résultats en Product
// URL modèle:
//   https://world.openfoodfacts.org/cgi/search.pl?search_terms=<query>&search_simple=1&action=process&json=1&page_size=<limit>
// - <query> doit être encodée via encodeURIComponent
// - <limit> par défaut 5
// Mapping attendu:
// - id ← p.code (ou p._id en fallback)
// - name ← p.product_name (ou p.generic_name / p.brands en fallback)
// - stock ← 0
// Résilience: si fetch échoue ou !res.ok, retourner []
declare const fetch: any

export class OpenFoodFactsLister implements ProductLister {
  async list(query: string, limit: number = 5): Promise<Product[]> {
    try {
      const encoded = encodeURIComponent(query)
      const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encoded}&search_simple=1&action=process&json=1&page_size=${limit}`

      const result = await fetch(url)
      if (!result.ok) return []

      const data = await result.json()
      if (!data?.products || !Array.isArray(data.products)) return []

      const items: Product[] = data.products
        .map((product: any) => {
          const id = product.code || product._id
          const name = product.product_name || product.generic_name || product.brands
          if (!id || !name) return null
          return { id, name, stock: 0 } as Product
        })
        .filter((x: Product | null): x is Product => x !== null)

      return items
    } catch {
      // Erreur réseau ou JSON invalide → []
      return []
    }
  }
}
