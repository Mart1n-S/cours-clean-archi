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

// Exercice 7 — Implémenter la route /health
describe.skip('Exercice 7 — HTTP health route', () => {
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
    const { startServer } = await import('src/frameworks/http/server')
    httpServer = startServer(0, '127.0.0.1')
    await new Promise(res => httpServer.on('listening', res))
    const address = httpServer.address()
    const port = typeof address === 'object' && address && 'port' in address ? address.port : 0
    baseUrl = `http://127.0.0.1:${port}`
  })

  afterAll(() => {
    if (!skipSuite && httpServer) httpServer.close()
  })

  it('GET /health returns 200 with ok', async () => {
    if (skipSuite) return
    const response = await req('GET', `${baseUrl}/health`)
    expect(response.status).toBe(200)
    expect(response.data.status).toBe('ok')
  })
})

// Product lifecycle covered elsewhere with controller tests; HTTP layer focuses on routing/errors here.
