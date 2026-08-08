import { cp, mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const gardenRoot = path.resolve(import.meta.dirname, '..')
const pulsarRoot = path.resolve(gardenRoot, '..', '..', '..', 'Documents', 'Pulsar')
const targetRoot = path.resolve(gardenRoot, 'public', 'pulsarnav')
const expectedTargetRoot = `${path.resolve(gardenRoot, 'public')}${path.sep}`

if (!targetRoot.startsWith(expectedTargetRoot)) {
  throw new Error(`Refusing to replace unexpected directory: ${targetRoot}`)
}

const workerUrl = pathToFileURL(path.join(pulsarRoot, 'dist', 'server', 'index.js'))
workerUrl.searchParams.set('sync', Date.now().toString())
const { default: worker } = await import(workerUrl.href)

const response = await worker.fetch(
  new Request('http://localhost/', { headers: { accept: 'text/html' } }),
  { ASSETS: { fetch: async () => new Response('Not found', { status: 404 }) } },
  { waitUntil() {}, passThroughOnException() {} },
)

if (!response.ok) throw new Error(`Pulsar renderer returned ${response.status}`)

const html = (await response.text())
  .replaceAll('/assets/', '/pulsarnav/assets/')
  .replaceAll('/favicon.svg', '/pulsarnav/favicon.svg')

await rm(targetRoot, { recursive: true, force: true })
await mkdir(targetRoot, { recursive: true })
await cp(path.join(pulsarRoot, 'dist', 'client', 'assets'), path.join(targetRoot, 'assets'), { recursive: true })
await cp(path.join(pulsarRoot, 'dist', 'client', 'favicon.svg'), path.join(targetRoot, 'favicon.svg'))
await writeFile(path.join(targetRoot, 'index.html'), html)

console.log('Synced Pulsar Navigator to public/pulsarnav')
