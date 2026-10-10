import { createServer } from 'node:http'
import { createReadStream, existsSync, statSync } from 'node:fs'
import path from 'node:path'

const root = path.resolve('out')
if (!existsSync(path.join(root, 'index.html'))) throw new Error('Build the static site with npm run build before browser testing')
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.txt': 'text/plain' }
const server = createServer((request, response) => {
    try {
        const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
        let file = path.resolve(root, '.' + pathname)
        if (file !== root && !file.startsWith(root + path.sep)) {
            response.writeHead(403).end()
            return
        }
        if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, 'index.html')
        if (!existsSync(file) || !statSync(file).isFile()) {
            response.writeHead(404).end()
            return
        }
        response.writeHead(200, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream' })
        createReadStream(file).pipe(response)
    } catch {
        response.writeHead(400).end()
    }
})
if (!process.env.PORTFOLIO_TEST_PORT) throw new Error('PORTFOLIO_TEST_PORT is required')
server.listen(Number(process.env.PORTFOLIO_TEST_PORT), '127.0.0.1')
process.on('SIGTERM', () => server.close())
process.on('SIGINT', () => server.close())
