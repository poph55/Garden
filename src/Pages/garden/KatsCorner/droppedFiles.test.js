import { describe, expect, it } from 'vitest'
import { collectDroppedFiles } from './droppedFiles'

function fileEntry(name, fullPath) {
  return { isFile: true, fullPath, file: (resolve) => resolve(new File(['image'], name)) }
}

function directory(batches) {
  return { isDirectory: true, createReader: () => {
    let index = 0
    return { readEntries: (resolve) => resolve(batches[index++] ?? []) }
  } }
}

describe('dropped upload files', () => {
  it('reads all directory batches and preserves nested paths for image matching', async () => {
    const root = directory([
      [fileEntry('front.jpg', '/Products/VIN123/front.jpg')],
      [directory([[fileEntry('back.png', '/Products/VIN456/back.png')]])],
    ])
    const files = await collectDroppedFiles({ items: [{ kind: 'file', webkitGetAsEntry: () => root, getAsFile: () => null }] })
    expect(files.map((file) => file.webkitRelativePath)).toEqual(['Products/VIN123/front.jpg', 'Products/VIN456/back.png'])
    expect(files.every((file) => file instanceof File)).toBe(true)
  })

  it('supports plain files without the directory API and ignores text items', async () => {
    const file = new File(['VIN,SS'], 'sales.csv')
    expect(await collectDroppedFiles({ items: [{ kind: 'string' }, { kind: 'file', getAsFile: () => file }] })).toEqual([file])
    expect(await collectDroppedFiles({ files: [file] })).toEqual([file])
  })

  it('reports unreadable folders instead of returning a partial upload', async () => {
    const entry = { isDirectory: true, createReader: () => ({ readEntries: (_, reject) => reject(new Error('Unreadable folder')) }) }
    await expect(collectDroppedFiles({ items: [{ kind: 'file', webkitGetAsEntry: () => entry, getAsFile: () => null }] })).rejects.toThrow('Unreadable folder')
  })
})
