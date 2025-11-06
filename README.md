# Mini Inventory — Clean Architecture (TypeScript, Jest)

Architecture pédagogique Clean Architecture. Tests Jest co‑localisés par feature.

## Parcours pédagogique (ré-implémentation guidée)

Les tests `*.spec.ts` contiennent des étapes numérotées (Étape 1 → 8). Par défaut, seule l’Étape 1 est active; les suivantes sont « gelées » via `describe.skip`.

- Étape 1 — Gateway mémoire: implémentez `src/adapters/gateways/memory_products.ts`
- Étape 2 — Use cases Add/Get (+ DIP): implémentez `AddProduct` et `GetProduct`
- Étape 3 — Use cases List/Buy: implémentez `ListStoredProducts` et `BuyProduct`
- Étape 4 — Controller + SearchProducts: implémentez `buildProductsController` et `SearchProducts`
- Étape 5 — DB fichier: implémentez `src/frameworks/db/file_repo.ts`
- Étape 6 — Gateway externe: implémentez `OpenFoodFactsLister`
- Étape 7 — Serveur HTTP (à implémenter): `/health`, 404 JSON, `/search`
- Étape 8 — Container/Config
  (TUI reste fonctionnelle et hors-parcours)

Activation d’une étape: dans les tests de l’étape, remplacez `describe.skip(...)` par `describe(...)`, puis lancez `npm test`. Échouez d’abord (ROUGE), implémentez, puis faites passer (VERT).

### Étape 1 — Détails (Gateway mémoire)

Objectif: un dépôt en mémoire (sans I/O) pour stocker des produits.

- Fichier: `src/adapters/gateways/memory_products.ts`
- Interfaces: `ProductReader`, `ProductWriter`, `ProductReaderAll`
- Implémentation attendue:
  - Utiliser une `Map<string, Product>`
  - `getById(id)` → `Product | null`
  - `save(product)` → enregistre dans la Map
  - `listAll()` → `Array.from(map.values())`
- Test actif: `src/adapters/gateways/memory_products.spec.ts`

### Étape 2 — Détails (Use cases Add/Get + DIP)

Objectif: valider et persister un produit (Add), récupérer par id (Get). Illustrer la substitution de dépôt (DIP).

- Fichiers: `src/app/usecases/add_product.ts`, `src/app/usecases/get_product.ts`
- Ports: AddProduct → `ProductWriter`, GetProduct → `ProductReader`
- Règles métier AddProduct:
  - `id` et `name` non vides → sinon `throw new Error('invalid_product')`
  - `stock >= 0` → sinon `throw new Error('invalid_stock')`
  - Enregistrer via `writer.save(p)` (sync/async support)
- GetProduct: déléguer à `reader.getById(id)` (sync/async)
- Tests à activer: `src/app/usecases/add_product.spec.ts`, `get_product.spec.ts`, `dip_substitution.spec.ts`

### Étape 3 — Détails (ListStoredProducts + BuyProduct)

Objectif: lister tout le stock et gérer un achat (décrément de stock sécurisé).

- Fichiers: `src/app/usecases/list_stored_products.ts`, `src/app/usecases/buy_product.ts`
- Ports: ListStoredProducts → `ProductReaderAll`; BuyProduct → `ProductReader` + `ProductWriter`
- Règles métier BuyProduct:
  - `quantity > 0` → sinon `throw new Error('invalid_qty')`
  - Produit introuvable → `throw new Error('not_found')`
  - Stock insuffisant → `throw new Error('insufficient_stock')`
  - Sinon: `updated = { ...p, stock: p.stock - quantity }`, `writer.save(updated)`, retourner `updated`
- Tests à activer: `src/app/usecases/list_stored_products.spec.ts`, `buy_product.spec.ts`

### Étape 4 — Détails (Controller + SearchProducts)

Objectif: adapter les use cases au protocole HTTP et déléguer la recherche.

- Fichiers: `src/adapters/controllers/products_controller.ts`, `src/app/usecases/search_products.ts`
- Controller (`buildProductsController`):
  - `add(body)` → parse `{ id, name, stock }` → 201 si ok; erreurs `'invalid_product'|'invalid_stock'|'invalid_qty'` → 400; `'not_found'` → 404; `'insufficient_stock'` → 409; sinon 500
  - `get(id)` → 200 avec le produit, 404 sinon
  - `buy(id, body)` → parse `{ quantity }`, délègue et mappe erreurs comme ci‑dessus
  - `search(query, limit?)` → délègue; en cas d’erreur, `500 { error: 'fetch_failed' }`
- SearchProducts: délègue à `ProductLister.list(query, limit)`
- Tests à activer: `src/adapters/controllers/products_controller.spec.ts`, `src/app/usecases/search_products.spec.ts`

### Étape 5 — Détails (FileRepo)

Objectif: implémenter un dépôt persistant sur fichier JSON.

- Fichier: `src/frameworks/db/file_repo.ts`
- Interfaces: `ProductReader`, `ProductWriter`, `ProductReaderAll`
- Cache en mémoire: `Map<string, Product>` chargée à la première utilisation (lazy)
- Sauvegarde: chaque `save()` écrit le JSON sur disque
- Format disque: objet `{ [id]: Product }` (StoreShape)
- Guide:
  - `load()`: si déjà chargé → return; lire/parse, peupler la Map; erreurs (ENOENT/JSON invalide) → Map vide
  - `persist()`: `fs.mkdir(dirname, { recursive:true })`, sérialiser `JSON.stringify(obj, null, 2)`, `fs.writeFile`
  - `getById`/`listAll`/`save`: toujours `await load()` avant; `save` appelle `await persist()`
- Test à activer: `src/frameworks/db/file_repo.spec.ts`

### Étape 6 — Détails (OpenFoodFacts)

Objectif: lister des produits via l’API publique OpenFoodFacts (suggestions, `stock: 0`).

- Fichier: `src/adapters/gateways/openfoodfacts_lister.ts`
- URL modèle:
  `https://world.openfoodfacts.org/cgi/search.pl?search_terms=<query>&search_simple=1&action=process&json=1&page_size=<limit>`
  - `<query>` encodée via `encodeURIComponent`
  - `<limit>` par défaut 5
- Mapping (→ Product): `id ← code/_id`, `name ← product_name/generic_name/brands`, `stock ← 0`
- Tolérance: si `!res.ok` ou erreur réseau → `[]`
- Test à activer: `src/adapters/gateways/openfoodfacts_lister.spec.ts` (mock de `fetch`)

### Étape 7 — Détails (HTTP — routes à implémenter)

Objectif: ajouter les routes HTTP basiques via Express, découplées et testées.

- Fichiers: `src/frameworks/http/app.ts`, `src/frameworks/http/routes/health_route.ts`, `src/frameworks/http/routes/search_route.ts`
- À faire:
  - GET `/health` → `200 { status: 'ok' }`
  - 404 générique JSON → `404 { error: 'not_found' }` pour routes inconnues
  - GET `/search?query=&limit=` → déléguer à le controller (`controller.search`) et relayer status/body
  - Monter ces routes dans `app.ts` (Express)
- Tests à activer: `src/frameworks/http/server.spec.ts`, `server_notfound.spec.ts`, `server_search.spec.ts`

Note: Le parsing JSON invalide (`invalid_json`) et le relai des erreurs du controller sont déjà en place.

### Étape 8 — Détails (Container + Config)

- Tests à activer: `src/app/container.spec.ts`, `src/frameworks/config/config.spec.ts`

## Scripts utiles

- `npm test` — lance les tests
- `npm run test:watch` — mode watch
- `npm run test:ci` — tests séquentiels + couverture
- `npm run build` — build TypeScript vers `dist/`
- `npm run serve` — serveur HTTP (buildé)
- `npm run dev:serve` — exécution TS directe (ts-node)
- `npm run dev:tui` — TUI de démonstration (hors-parcours)
 

### .env (optionnel)

- Copier `.env.example` en `.env` pour documenter vos variables locales
- Node ne charge pas `.env` automatiquement: soit vous `source .env` avant d'exécuter, soit vous préfixez vos commandes, ex.

```
cp .env.example .env
export $(cat .env | xargs)   # charge dans la session
npm run dev:tui

# ou en préfixe
STORE_FILE=data/products.json npm run serve
```

## Commandes utiles

```
npm i
npm test
npm run test:ci
npm run build
npm run serve
```

## Recherche OpenFoodFacts

- Porte d’entrée lecture pour suggérer des produits à ajouter (stock=0)
- HTTP: `GET /search?query=chocolate&limit=3` (à implémenter à l’Étape 7)
- TUI: option 5 « Recherche OpenFoodFacts (ajouter) »

Retourne un tableau de `{ id, name, stock: 0 }` à partir de l’API publique OpenFoodFacts. Réseau requis. L’ajout effectif se fait via l’action « ajouter » (la TUI le propose).

## HTTP API (basique)

- `GET /health` → `{ status: 'ok' }` (Étape 7)
- `POST /products` body `{ id, name, stock }` → 201
- `GET /products/:id` → 200 `{ id, name, stock }` ou 404
- `POST /products/:id/buy` body `{ quantity }` → 200 produit mis à jour
- `GET /search?query=:q&limit=:n` → 200 `[Product]` (Étape 7; voir section recherche)

Codes d’erreur: `invalid_json` 400, `invalid_qty` 400, `not_found` 404, `insufficient_stock` 409.

## TUI (interface terminal)

- Lancer: `npm run build && npm run tui` ou `npm run dev:tui`
- Actions: lister stock, ajouter, acheter, consulter, rechercher des exemples OFF et les ajouter
- Persistance auto dans `data/products.json` (configurable via STORE_FILE ou fichier de config)
