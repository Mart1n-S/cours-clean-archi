import { Router } from 'express'

// TODO Exercice 7: Implémenter la route GET /health → 200 { status: 'ok' }
export function healthRouter(): Router {
  const router = Router()

  router.get('/health', (_req, response) => {
    response.status(200).json({ status: 'ok' })
  })

  return router
}
