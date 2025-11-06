import { MemoryProductsGateway } from 'src/adapters/gateways/memory_products'

// Étape 1 — Implémentez MemoryProductsGateway (in-memory Map)
// Objectif: faire passer ce test. Ensuite, passez à l'Étape 2.
describe('Étape 1 — MemoryProductsGateway', () => {
  it('returns null when missing and value after save', async () => {
    const repository = new MemoryProductsGateway()
    expect(repository.getById('x')).toBeNull()
    repository.save({ id: 'x', name: 'Box', stock: 1 })
    const product = repository.getById('x')
    expect(product?.name).toBe('Box')
  })
})
