import express, { Application, Request, Response, NextFunction } from 'express'
import { buildContainer } from '../../app/container'
import { loadConfig } from '../config/config'
import { buildProductsController } from '../../adapters/controllers/products_controller'
import { productsRouter } from './routes/products_routes'
import { healthRouter } from './routes/health_route'
import { searchRouter } from './routes/search_route'

export async function buildHttpApp(): Promise<Application> {
  const app = express()

  // Dependencies wiring (Clean Architecture: frameworks <- adapters)
  const config = await loadConfig()
  const container = buildContainer({ storeFile: config.storeFile })
  const controller = buildProductsController(container)

  // Middlewares
  app.use(express.json())

  // Routes (Exercice 7 laissera /health, /search et le 404 générique à implémenter)
  app.use(healthRouter())
  app.use(searchRouter(controller))
  app.use(productsRouter(controller))

  // 404 générique JSON
  app.use((_req, response) => {
    response.status(404).json({ error: 'not_found' })
  })

  // Error handler (invalid JSON, generic fallback)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (isInvalidJsonError(error)) {
      return res.status(400).json({ error: 'invalid_json' })
    }
    res.status(500).json({ error: 'internal_error' })
  })

  return app
}

function isInvalidJsonError(error: unknown): boolean {
  const errorObject = error as any
  // body-parser sets type: 'entity.parse.failed' for JSON parse errors
  return !!errorObject && typeof errorObject === 'object' && errorObject.type === 'entity.parse.failed'
}
