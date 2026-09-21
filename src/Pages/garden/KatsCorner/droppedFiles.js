async function readEntry(entry) {
  if (entry.isFile) {
    const file = await new Promise((resolve, reject) => entry.file(resolve, reject))
    Object.defineProperty(file, 'webkitRelativePath', { value: entry.fullPath.replace(/^\//, ''), configurable: true })
    return [file]
  }
  if (!entry.isDirectory) return []
  const reader = entry.createReader()
  const files = []
  // Directory readers may return only a batch at a time.
  while (true) {
    const entries = await new Promise((resolve, reject) => reader.readEntries(resolve, reject))
    if (!entries.length) return files
    for (const child of entries) files.push(...await readEntry(child))
  }
}

export async function collectDroppedFiles(dataTransfer) {
  // Capture entries and files before the drop event's data store closes.
  const items = Array.from(dataTransfer.items ?? []).filter((item) => item.kind === 'file')
  const sources = items.map((item) => ({ entry: item.webkitGetAsEntry?.(), file: item.getAsFile() }))
  const fallback = Array.from(dataTransfer.files ?? [])
  if (!sources.length) return fallback
  const files = []
  for (const { entry, file } of sources) {
    if (entry) files.push(...await readEntry(entry))
    else if (file) files.push(file)
  }
  return files
}
