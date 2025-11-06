import http from 'http'
import net from 'net'
import { startServer } from 'src/frameworks/http/server'

function reqRaw(method: string, url: string, body?: string): Promise<{ status: number, data: any }> {
  return new Promise((resolve, reject) => {
    const urlObject = new URL(url)
    const opts: http.RequestOptions = {
      method,
      hostname: urlObject.hostname,
      port: Number(urlObject.port),
      path: urlObject.pathname + (urlObject.search || ''),
      headers: body ? { 'content-type': 'application/json', 'content-length': Buffer.byteLength(body) } : undefined
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
    if (body) httpRequest.write(body)
    httpRequest.end()
  })
}

describe('HTTP — invalid JSON', () => {
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

  it('returns 400 invalid_json when body is malformed on POST /products', async () => {
    if (skipSuite) return
    const response = await reqRaw('POST', `${baseUrl}/products`, 'not-a-json')
    expect(response.status).toBe(400)
    expect(response.data.error).toBe('invalid_json')
  })

  it('returns 400 invalid_json when body invalid on POST /products/:id/buy', async () => {
    if (skipSuite) return
    const response = await reqRaw('POST', `${baseUrl}/products/ij1/buy`, 'not-a-json')
    expect(response.status).toBe(400)
    expect(response.data.error).toBe('invalid_json')
  })
})
