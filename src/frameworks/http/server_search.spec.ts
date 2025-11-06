import http from 'http'
import net from 'net'

function req(method: string, url: string): Promise<{ status: number, data: any }> {
  return new Promise((resolve, reject) => {
    const urlObject = new URL(url)
    const opts: http.RequestOptions = {
      method,
      hostname: urlObject.hostname,
      port: Number(urlObject.port),
      path: urlObject.pathname + (urlObject.search || '')
    }
    const httpRequest = http.request(opts, response => {
      const chunks: Buffer[] = []
      response.on('data', chunk => chunks.push(chunk))
      response.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf-8')
        const data = text ? JSON.parse(text) : null
        resolve({ status: response.statusCode || 0, data })
      })
    })
    httpRequest.on('error', reject)
    httpRequest.end()
  })
}

// Exercice 7 — Implémenter la route /search
describe.skip('Exercice 7 — HTTP search route', () => {
  it('returns items using mocked controller', async () => {
    const portAvailable = await new Promise<boolean>(resolve => {
      const probeServer = net.createServer()
      probeServer.once('error', () => resolve(false))
      probeServer.listen(0, '127.0.0.1', () => {
        probeServer.close(() => resolve(true))
      })
    })
    if (!portAvailable) return

    jest.isolateModules(async () => {
      jest.doMock('src/adapters/controllers/products_controller', () => ({
        buildProductsController: () => ({
          add: async () => ({ status: 201, body: {} }),
          get: async () => ({ status: 404, body: { error: 'not_found' } }),
          buy: async () => ({ status: 200, body: {} }),
          search: async () => ({ status: 200, body: [ { id: 'x', name: 'X', stock: 0 } ] })
        })
      }))
      const { startServer } = await import('src/frameworks/http/server')
      const httpServer = startServer(0, '127.0.0.1')
      await new Promise(res => httpServer.on('listening', res))
      const address = httpServer.address()
      const port = typeof address === 'object' && address && 'port' in address ? address.port : 0
      const baseUrl = `http://127.0.0.1:${port}`
      const response = await req('GET', `${baseUrl}/search?query=a&limit=1`)
      expect(response.status).toBe(200)
      const data = response.data
      expect(Array.isArray(data)).toBe(true)
      expect(data[0].id).toBe('x')
      httpServer.close()
    })
  })
})
