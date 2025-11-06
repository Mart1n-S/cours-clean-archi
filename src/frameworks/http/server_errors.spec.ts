import http from 'http'
import net from 'net'

function req(method: string, url: string, body?: any): Promise<{ status: number, data: any }> {
  return new Promise((resolve, reject) => {
    const urlObject = new URL(url)
    const payload = body ? JSON.stringify(body) : undefined
    const opts: http.RequestOptions = {
      method,
      hostname: urlObject.hostname,
      port: Number(urlObject.port),
      path: urlObject.pathname + (urlObject.search || ''),
      headers: payload ? { 'content-type': 'application/json', 'content-length': Buffer.byteLength(payload) } : undefined
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
    if (payload) httpRequest.write(payload)
    httpRequest.end()
  })
}

describe('HTTP — controller error mapping (mocked)', () => {
  let httpServer: http.Server
  let baseUrl: string
  let skipSuite = false

  beforeAll(async () => {
    const portAvailable = await new Promise<boolean>(resolve => {
      const probeServer = net.createServer()
      probeServer.once('error', () => resolve(false))
      probeServer.listen(0, '127.0.0.1', () => {
        probeServer.close(() => resolve(true))
      })
    })
    if (!portAvailable) { skipSuite = true; return }
    await new Promise<void>(resolve => {
      jest.isolateModules(async () => {
        jest.doMock('src/adapters/controllers/products_controller', () => ({
          buildProductsController: () => ({
            add: async () => ({ status: 201, body: {} }),
            get: async (id: string) => id === 'missing'
              ? ({ status: 404, body: { error: 'not_found' } })
              : ({ status: 200, body: { id, name: 'Ok', stock: 1 } }),
            buy: async (_id: string, body: any) => {
              if (!body || typeof body.quantity !== 'number' || body.quantity < 1) {
                return { status: 400, body: { error: 'invalid_qty' } }
              }
              if (body.quantity > 1) {
                return { status: 409, body: { error: 'insufficient_stock' } }
              }
              return { status: 200, body: { stock: 0 } }
            },
            search: async () => ({ status: 200, body: [] })
          })
        }))
        const { startServer } = await import('src/frameworks/http/server')
        httpServer = startServer(0, '127.0.0.1')
        await new Promise(res => httpServer.on('listening', res))
        const address = httpServer.address()
        const port = typeof address === 'object' && address && 'port' in address ? address.port : 0
        baseUrl = `http://127.0.0.1:${port}`
        resolve()
      })
    })
  })

  afterAll(() => {
    if (!skipSuite && httpServer) httpServer.close()
  })

  it('returns 404 for missing product', async () => {
    if (skipSuite) return
    const response = await req('GET', `${baseUrl}/products/missing`)
    expect(response.status).toBe(404)
  })

  it('returns 400 for invalid quantity', async () => {
    if (skipSuite) return
    const response = await req('POST', `${baseUrl}/products/e1/buy`, { quantity: 0 })
    expect(response.status).toBe(400)
  })

  it('returns 409 for insufficient stock', async () => {
    if (skipSuite) return
    const response = await req('POST', `${baseUrl}/products/e2/buy`, { quantity: 2 })
    expect(response.status).toBe(409)
  })
})
