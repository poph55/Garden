import { strFromU8, unzipSync } from 'fflate'

export const SOURCE_ROW_NUMBER = Symbol('sourceRowNumber')

function attribute(xml, name) {
  return xml.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1]
}

function partPath(target) {
  return new URL(target, 'https://workbook.local/xl/workbook.xml').pathname.slice(1)
}

export function readWorkbookFormatting(bytes, headerRowNumber, headers) {
  const files = unzipSync(new Uint8Array(bytes))
  const text = (path) => files[path] ? strFromU8(files[path]) : ''
  const sheet = text('xl/workbook.xml').match(/<sheet\b[^>]*\/>/)?.[0]
  const sheetId = attribute(sheet ?? '', 'r:id')
  const relationships = text('xl/_rels/workbook.xml.rels').match(/<Relationship\b[^>]*\/>/g) ?? []
  const sheetRelation = relationships.find((entry) => attribute(entry, 'Id') === sheetId)
  const styleRelation = relationships.find((entry) => attribute(entry, 'Type')?.endsWith('/styles'))
  const themeRelation = relationships.find((entry) => attribute(entry, 'Type')?.endsWith('/theme'))
  const worksheet = text(partPath(attribute(sheetRelation ?? '', 'Target') ?? 'worksheets/sheet1.xml'))
  const stylesXml = text(partPath(attribute(styleRelation ?? '', 'Target') ?? 'styles.xml'))
  if (!worksheet || !stylesXml) throw new Error('Could not read the Excel workbook formatting. Please save it as XLSX and try again.')
  const rowFormats = {}
  for (const match of worksheet.matchAll(/<row\b([^>]*?)(?:\/>|>([\s\S]*?)<\/row>)/g)) {
    const row = { cells: {} }
    for (const name of ['ht', 'customHeight', 's', 'customFormat']) {
      const value = attribute(match[1], name)
      if (value !== undefined) row[name] = value
    }
    for (const cell of (match[2] ?? '').matchAll(/<c\b([^>]*?)(?:\/>|>)/g)) {
      const column = attribute(cell[1], 'r')?.replace(/\d+$/, '')
      if (column) row.cells[column] = Number(attribute(cell[1], 's') ?? row.s ?? 0)
    }
    rowFormats[attribute(match[1], 'r')] = row
  }
  return {
    headers: headers.map((header) => String(header ?? '')),
    headerRowNumber,
    rowFormats,
    stylesXml,
    themeXml: themeRelation ? text(partPath(attribute(themeRelation, 'Target'))) : '',
    worksheetOpen: worksheet.match(/<worksheet\b[^>]*>/)?.[0],
    columnsXml: worksheet.match(/<cols\b[^>]*>[\s\S]*?<\/cols>/)?.[0] ?? '',
    sheetFormatXml: worksheet.match(/<sheetFormatPr\b[^>]*\/>/)?.[0] ?? '',
    pageMarginsXml: worksheet.match(/<pageMargins\b[^>]*\/>/)?.[0] ?? '',
  }
}
