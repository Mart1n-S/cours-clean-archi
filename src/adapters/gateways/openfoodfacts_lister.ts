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
  async list(_query: string, _limit: number = 5): Promise<Product[]> {
    throw new Error('TODO Etape 6: OpenFoodFactsLister.list')
  }
}
