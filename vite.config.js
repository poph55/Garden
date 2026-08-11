import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { Buffer } from 'node:buffer'
import subwayHandler from './netlify/functions/subway.js'

const localSubwayApi = {
  name: 'local-subway-api',
  configureServer(server) {
    server.middlewares.use('/api/subway', async (_request, response) => {
      const result = await subwayHandler()
      response.statusCode = result.status
      result.headers.forEach((value, key) => response.setHeader(key, value))
      response.end(Buffer.from(await result.arrayBuffer()))
    })
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localSubwayApi],
})
