import http from 'http'
import { buildHttpApp } from './app'

export function startServer(port: number = 3000, host: string = '127.0.0.1') {
  const server = http.createServer()

  // Build app, attach, then start listening to avoid race conditions
  void (async () => {
    const app = await buildHttpApp()
    server.on('request', app)
    server.listen(port, host, () => {
      const address = server.address()
      const showPort = typeof address === 'object' && address ? address.port : port
      if (process.env.NODE_ENV !== 'test') {
        console.log(`http server listening on http://${host}:${showPort}`)
      }
    })
  })()

  return server
}

if (require.main === module) {
  const port = process.env.PORT ? Number(process.env.PORT) : 3000
  startServer(port)
}
