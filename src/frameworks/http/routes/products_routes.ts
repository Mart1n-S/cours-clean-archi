import { Router, Request, Response, NextFunction } from 'express'

type StatusBody = { status: number, body: unknown }

export function productsRouter(controller: {
  add: (body: any) => Promise<StatusBody>
  get: (id: string) => Promise<StatusBody>
  buy: (id: string, body: any) => Promise<StatusBody>
}): Router {
  const router = Router()

  router.post('/products', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await controller.add(req.body)
      res.status(result.status).json(result.body)
    } catch (error) {
      next(error)
    }
  })

  router.get('/products/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await controller.get(req.params.id)
      res.status(result.status).json(result.body)
    } catch (error) {
      next(error)
    }
  })

  router.post('/products/:id/buy', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await controller.buy(req.params.id, req.body)
      res.status(result.status).json(result.body)
    } catch (error) {
      next(error)
    }
  })

  return router
}
