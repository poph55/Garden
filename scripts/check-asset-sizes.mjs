import { readdir, stat } from 'node:fs/promises'
import path from 'node:path'

const limits = {
  '.js': 250 * 1024,
  '.css': 100 * 1024,
  '.png': 1.5 * 1024 * 1024,
  '.jpg': 1.5 * 1024 * 1024,
  '.jpeg': 1.5 * 1024 * 1024,
  '.webp': 1.5 * 1024 * 1024,
}

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(entries.map(entry => {
    const target = path.join(directory, entry.name)
    return entry.isDirectory() ? filesIn(target) : target
  }))
  return files.flat()
}

const dist = path.resolve('dist')
const files = await filesIn(dist)
const violations = []

for (const file of files) {
  const relative = path.relative(dist, file)
  if (relative.startsWith(`pulsarnav${path.sep}`)) continue
  // Phaser is isolated behind the optional Overgrown route. Keep a separate
  // ceiling for that lazily loaded engine without weakening the main bundle.
  const limit = /^assets[\\/]createGame-.*\.js$/.test(relative)
    ? 1.5 * 1024 * 1024
    : limits[path.extname(file).toLowerCase()]
  if (!limit) continue
  const { size } = await stat(file)
  if (size > limit) violations.push(`${relative}: ${(size / 1024).toFixed(1)} KB > ${(limit / 1024).toFixed(0)} KB`)
}

const favicon = await stat(path.join(dist, 'favicon.png'))
if (favicon.size > 64 * 1024) violations.push(`favicon.png: ${(favicon.size / 1024).toFixed(1)} KB > 64 KB`)

if (violations.length) {
  console.error(`Asset budget exceeded:\n${violations.map(item => `- ${item}`).join('\n')}`)
  process.exitCode = 1
} else {
  console.log(`Asset budgets passed for ${files.length} production files.`)
}
