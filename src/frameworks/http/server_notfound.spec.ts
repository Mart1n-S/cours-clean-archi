import http from 'http'
import net from 'net'
import { startServer } from 'src/frameworks/http/server'

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

// Exercice 7 — Implémenter les routes not found et HEAD/health
describe('Exercice 7 — HTTP not found', () => {
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
    httpServer = startServer(0, '127.0.0.1')
    await new Promise(res => httpServer.on('listening', res))
    const address = httpServer.address()
    const port = typeof address === 'object' && address && 'port' in address ? address.port : 0
    baseUrl = `http://127.0.0.1:${port}`
  })

  afterAll(() => { if (!skipSuite && httpServer) httpServer.close() })

  it('GET /unknown returns 404', async () => {
    if (skipSuite) return
    const response = await req('GET', `${baseUrl}/unknown`)
    expect(response.status).toBe(404)
    expect(response.data.error).toBe('not_found')
  })

  it('HEAD /health mirrors GET (200)', async () => {
    if (skipSuite) return
    const response = await req('HEAD', `${baseUrl}/health`)
    expect(response.status).toBe(200)
  })
})
