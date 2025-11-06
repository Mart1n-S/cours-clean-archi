import readline from 'readline'
import { loadConfig } from '../config/config'
import { buildContainer } from '../../app/container'
import { Product } from '../../domain/product'

function createReadlineInterface() {
  return readline.createInterface({ input: process.stdin, output: process.stdout })
}

function ask(question: string): Promise<string> {
  const rl = createReadlineInterface()
  return new Promise(resolve => rl.question(question, answer => { rl.close(); resolve(answer) }))
}

async function askNumber(question: string): Promise<number> {
  while (true) {
    const input = await ask(question)
    const parsed = Number(input)
    if (!Number.isNaN(parsed)) return parsed
    console.log('Veuillez entrer un nombre')
  }
}

function printHeader(title: string) {
  const line = '-'.repeat(60)
  console.log(`\n${line}\n${title}\n${line}`)
}

function printProducts(items: Product[]) {
  if (items.length === 0) { console.log('(aucun produit)'); return }
  console.log('ID'.padEnd(12), 'NAME'.padEnd(24), 'STOCK')
  console.log('-'.repeat(12), '-'.repeat(24), '-----')
  for (const product of items) console.log(product.id.padEnd(12), product.name.padEnd(24), String(product.stock))
}

export async function runTui() {
  const config = await loadConfig()
  const container = buildContainer({ storeFile: config.storeFile })

  while (true) {
    printHeader('Mini Inventory - TUI')
    console.log('1) Lister les produits (stockés)')
    console.log('2) Ajouter un produit')
    console.log('3) Acheter une quantité')
    console.log('4) Consulter un produit')
    console.log('5) Recherche OpenFoodFacts (ajouter)')
    console.log('0) Quitter')
    const choice = await ask('Choix > ')

    if (choice === '0') {
      console.log('Au revoir')
      break
    }

    if (choice === '1') {
      const items = await container.listStoredProducts.exec()
      printProducts(items)
      continue
    }

    if (choice === '2') {
      const id = await ask('id: ')
      const name = await ask('name: ')
      const stock = await askNumber('stock: ')
      try {
        await container.addProduct.exec({ id, name, stock })
        console.log('✓ ajouté')
      } catch (error) {
        console.log('Erreur:', error instanceof Error ? error.message : String(error))
      }
      continue
    }

    if (choice === '3') {
      const id = await ask('id: ')
      const quantity = await askNumber('quantité: ')
      try {
        const product = await container.buyProduct.exec(id, quantity)
        console.log('✓ acheté, nouveau stock =', product.stock)
      } catch (error) {
        console.log('Erreur:', error instanceof Error ? error.message : String(error))
      }
      continue
    }

    if (choice === '4') {
      const id = await ask('id: ')
      const product = await container.getProduct.exec(id)
      if (!product) console.log('introuvable')
      else printProducts([product])
      continue
    }

    if (choice === '5') {
      const query = await ask('recherche (ex: chocolate): ')
      const limit = await askNumber('limit: ')
      const items = await container.searchProducts.exec(query, limit)
      printHeader(`Résultats (${items.length})`)
      items.forEach((product, index) => console.log(`${String(index + 1).padStart(2)}. ${product.name} [${product.id}]`))
      const pick = await askNumber('numéro à ajouter (0 pour annuler): ')
      if (pick <= 0 || pick > items.length) continue
      const chosen = items[pick - 1]
      const stock = await askNumber('stock initial: ')
      try {
        await container.addProduct.exec({ id: chosen.id, name: chosen.name, stock })
        console.log('✓ ajouté')
      } catch (error) {
        console.log('Erreur:', error instanceof Error ? error.message : String(error))
      }
      continue
    }

    console.log('Choix invalide')
  }
}

if (require.main === module) {
  runTui()
}
