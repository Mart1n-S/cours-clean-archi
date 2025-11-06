import { Router } from 'express'

type StatusBody = { status: number; body: unknown }

// TODO Exercice 7: Implémenter la route GET /search?query=&limit=
// - Déléguer à controller.search(query, limit)
// - Répondre avec le status/JSON du controller
export function searchRouter(controller: {
  search: (query: string, limit?: number) => Promise<StatusBody>
}): Router {
  const router = Router()

  router.get('/search', async (req, response) => {
    const query = String(req.query.query ?? '')
    const limit = req.query.limit ? Number(req.query.limit) : undefined

    try {
      const { status, body } = await controller.search(query, limit)
      response.status(status).json(body)
    } catch {
      response.status(500).json({ error: 'internal_error' })
    }
  })

  return router
}
