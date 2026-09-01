import { zipSync } from 'fflate'
import { WEEKLY_FABRICS, weeklyStylesInExportOrder } from './reportModel'

const encoder = new TextEncoder()
const MIME_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
const RATING_STYLE = { great: 2, good: 3, ok: 4, slow: 5 }

function escapeXml(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;')
}

function normalized(value) {
  return String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function columnName(index) {
  let value = index + 1
  let name = ''
  while (value > 0) {
    value -= 1
    name = String.fromCharCode(65 + (value % 26)) + name
    value = Math.floor(value / 26)
  }
  return name
}

function cellXml(value, reference, style = 0) {
  if (typeof value === 'number' && Number.isFinite(value)) return `<c r="${reference}" s="${style}"><v>${value}</v></c>`
  return `<c r="${reference}" s="${style}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(value)}</t></is></c>`
}

function sourceColumns(styles) {
  const columns = []
  const seen = new Set()
  for (const style of styles) {
    const row = style.sourceRow ?? { VIN: style.vin, 'Style Description': style.description, 'SS Ratio': style.ss }
    for (const key of Object.keys(row)) {
      if (!seen.has(key)) {
        seen.add(key)
        columns.push(key)
      }
    }
  }
  return columns.length ? columns : ['VIN', 'Style Description', 'SS Ratio']
}

function displayValue(style, column) {
  const token = normalized(column)
  if (['vin', 'vendor item number', 'item'].includes(token)) return style.vin
  if (['style description', 'description', 'style', 'color description'].includes(token)) return style.description
  if (['ss', 'ss ratio', 'sell through', 'sell through'].includes(token)) return style.ss
  return style.sourceRow?.[column] ?? ''
}

function worksheetXml(styles) {
  const columns = sourceColumns(styles)
  const lastColumn = columnName(columns.length - 1)
  const rows = [
    `<row r="1" ht="24" customHeight="1">${columns.map((column, index) => cellXml(column, `${columnName(index)}1`, 1)).join('')}</row>`,
    ...styles.map((style, rowIndex) => {
      const rowNumber = rowIndex + 2
      const rowStyle = RATING_STYLE[style.rating ?? style.group.classification]
      return `<row r="${rowNumber}">${columns.map((column, columnIndex) => cellXml(displayValue(style, column), `${columnName(columnIndex)}${rowNumber}`, rowStyle)).join('')}</row>`
    }),
  ]
  const widths = columns.map((column, index) => `<col min="${index + 1}" max="${index + 1}" width="${Math.min(42, Math.max(12, String(column).length + 4))}" customWidth="1"/>`).join('')
  const dimension = styles.length ? `A1:${lastColumn}${styles.length + 1}` : `A1:${lastColumn}1`
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><dimension ref="${dimension}"/><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>${widths}</cols><sheetData>${rows.join('')}</sheetData><autoFilter ref="${dimension}"/></worksheet>`
}

function stylesXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="3"><font><sz val="11"/><name val="Aptos"/></font><font><b/><color rgb="FFFFFFFF"/><sz val="11"/><name val="Aptos"/></font><font><color rgb="FF3E3137"/><sz val="11"/><name val="Aptos"/></font></fonts><fills count="7"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF4F3240"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFC6E0B4"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFFEB9C"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFE7E6E6"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFFC7CE"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="6"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="center"/></xf><xf numFmtId="0" fontId="2" fillId="3" borderId="0" xfId="0" applyFont="1" applyFill="1"/><xf numFmtId="0" fontId="2" fillId="4" borderId="0" xfId="0" applyFont="1" applyFill="1"/><xf numFmtId="0" fontId="2" fillId="5" borderId="0" xfId="0" applyFont="1" applyFill="1"/><xf numFmtId="0" fontId="2" fillId="6" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`
}

export async function buildWeeklyWorkbookXlsx(report) {
  const sheets = WEEKLY_FABRICS.map((fabric) => weeklyStylesInExportOrder(report, fabric))
  const files = {
    '[Content_Types].xml': encoder.encode('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>'),
    '_rels/.rels': encoder.encode('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'),
    'xl/workbook.xml': encoder.encode('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Knits" sheetId="1" r:id="rId1"/><sheet name="Wovens" sheetId="2" r:id="rId2"/></sheets></workbook>'),
    'xl/_rels/workbook.xml.rels': encoder.encode('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'),
    'xl/styles.xml': encoder.encode(stylesXml()),
    'xl/worksheets/sheet1.xml': encoder.encode(worksheetXml(sheets[0])),
    'xl/worksheets/sheet2.xml': encoder.encode(worksheetXml(sheets[1])),
  }
  return new Blob([zipSync(files)], { type: MIME_TYPE })
}
