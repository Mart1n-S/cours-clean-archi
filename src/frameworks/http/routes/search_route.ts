import { Router } from 'express'

// TODO Exercice 7: Implémenter la route GET /search?query=&limit=
// - Déléguer à controller.search(query, limit)
// - Répondre avec le status/JSON du controller
type StatusBody = { status: number, body: unknown }
export function searchRouter(_controller: {
  search: (query: string, limit?: number) => Promise<StatusBody>
}): Router {
  const router = Router()
  // à compléter dans l'exercice 7
  return router
}
