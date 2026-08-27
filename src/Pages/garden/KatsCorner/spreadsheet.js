function parseCsv(text) {
  const rows = []
  let row = []
  let cell = ''
  let quoted = false
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]
    if (character === '"' && quoted && text[index + 1] === '"') {
      cell += '"'
      index += 1
    } else if (character === '"') quoted = !quoted
    else if (character === ',' && !quoted) {
      row.push(cell)
      cell = ''
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && text[index + 1] === '\n') index += 1
      row.push(cell)
      if (row.some((value) => value.trim())) rows.push(row)
      row = []
      cell = ''
    } else cell += character
  }
  row.push(cell)
  if (row.some((value) => value.trim())) rows.push(row)
  return rows
}

export function rowsToObjects(rows) {
  const headerIndex = rows.findIndex((row) => {
    const headers = row.map((value) => String(value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim())
    return headers.includes('vin') && headers.some((header) => ['ss', 'ss ratio', 'sell through'].includes(header))
  })
  if (headerIndex < 0) throw new Error('Could not find VIN and SS columns in this spreadsheet.')
  const headers = rows[headerIndex]
  return rows.slice(headerIndex + 1).map((row) => Object.fromEntries(headers.map((header, index) => [String(header ?? ''), row[index] ?? ''])))
}

export async function readSpreadsheet(file) {
  if (file.name.toLowerCase().endsWith('.csv')) return rowsToObjects(parseCsv(await file.text()))
  const { readSheet } = await import('read-excel-file/browser')
  return rowsToObjects(await readSheet(file))
}
