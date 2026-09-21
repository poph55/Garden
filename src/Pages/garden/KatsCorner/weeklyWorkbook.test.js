import { describe, expect, it } from 'vitest'
import { Buffer } from 'node:buffer'
import { Readable } from 'node:stream'
import { strFromU8, unzipSync, zipSync } from 'fflate'
import readXlsxFile from 'read-excel-file/node'
import { parseWeeklySpreadsheetRows } from './reportModel'
import { buildWeeklyWorkbookXlsx } from './weeklyWorkbook'
import { rowsToObjects } from './spreadsheet'
import { buildWeeklyReportDocx } from './exportReport'

describe('buildWeeklyWorkbookXlsx', () => {
  it('keeps complete VIN blocks in descending total SS order with totals last and matching Word pages', async () => {
    const report = parseWeeklySpreadsheetRows([
      { VIN: 'MK-LOW', STYLE_DESCRIPTION: 'Blue', 'SS RATIO': 9, 'SLS UN': 10 },
      { VIN: 'MK-LOW', STYLE_DESCRIPTION: '', 'SS RATIO': 8, 'SLS UN': 20 },
      { VIN: 'MK-LOW Total', 'SS RATIO': 3.41, 'SLS UN': 30 },
      { VIN: 'MK-HIGH', STYLE_DESCRIPTION: 'Black', 'SS RATIO': 2.41, 'SLS UN': 5 },
      { VIN: 'MK-HIGH', STYLE_DESCRIPTION: '', 'SS RATIO': 6, 'SLS UN': 15 },
      { VIN: 'MK-HIGH', STYLE_DESCRIPTION: 'Ivory', 'SS RATIO': 2.44, 'SLS UN': 20 },
      { VIN: 'MK-HIGH Total', 'SS RATIO': 3.44, 'SLS UN': 40 },
      { VIN: 'MV-WOVEN', STYLE_DESCRIPTION: 'White', 'SS RATIO': 10, 'SLS UN': 4 },
      { VIN: 'MV-WOVEN Total', 'SS RATIO': 10, 'SLS UN': 4 },
    ])
    const blob = await buildWeeklyWorkbookXlsx(report)
    const sheets = await readXlsxFile(Readable.from(Buffer.from(await blob.arrayBuffer())))
    expect(sheets[0].data.slice(1).map(row => [row[0], row[1], row[2]])).toEqual([
      ['MK-HIGH', null, 6], ['MK-HIGH', 'Ivory', 2.44], ['MK-HIGH', 'Black', 2.41], ['MK-HIGH Total', null, 3.44],
      ['MK-LOW', 'Blue', 9], ['MK-LOW', null, 8], ['MK-LOW Total', null, 3.41],
    ])
    expect(sheets[1].data.slice(1).map(row => row[0])).toEqual(['MV-WOVEN', 'MV-WOVEN Total'])
    const word = await buildWeeklyReportDocx(report, 'knit')
    const xml = strFromU8(unzipSync(new Uint8Array(await word.arrayBuffer()))['word/document.xml'])
    expect(xml.indexOf('MK-HIGH - TTL')).toBeLessThan(xml.indexOf('MK-LOW - TTL'))
    expect(xml.indexOf('Ivory |')).toBeLessThan(xml.indexOf('Black |'))
    expect(xml).not.toContain('UNITS: 15 |')
  })

  it('carries source cell formats, widths, and heights with rows when sorting Excel uploads', async () => {
    const data = [
      ['VIN', 'STYLE_DESCRIPTION', 'SS RATIO', 'SLS UN', 'ST%'],
      ['MK0001', 'Lower knit', 2, 100, 0.25],
      ['MK0002', 'Higher knit', 5, 200, 0.75],
    ]
    const original = await buildWeeklyWorkbookXlsx(parseWeeklySpreadsheetRows(rowsToObjects(data)))
    const files = unzipSync(new Uint8Array(await original.arrayBuffer()))
    const encoder = new TextEncoder()
    const originalStyles = strFromU8(files['xl/styles.xml']).replace('<fonts ', '<numFmts count="1"><numFmt numFmtId="164" formatCode="0.0%"/></numFmts><fonts ').replace('numFmtId="0" fontId="2" fillId="3"', 'numFmtId="164" fontId="2" fillId="3"')
    files['xl/styles.xml'] = encoder.encode(originalStyles)
    const sourceRows = data.map((row, i) => `<row r="${i + 1}" ht="${[32, 40, 28][i]}" customHeight="1">${row.map((value, j) => `<c r="${String.fromCharCode(65 + j)}${i + 1}" s="${j === 4 && i ? 2 : [1, 5, 3][i]}"${typeof value === 'string' ? ' t="inlineStr"' : ''}>${typeof value === 'string' ? `<is><t>${value}</t></is>` : `<v>${value}</v>`}</c>`).join('')}</row>`).join('')
    files['xl/worksheets/sheet1.xml'] = encoder.encode(`<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetFormatPr defaultRowHeight="19"/><cols><col min="1" max="5" width="27" customWidth="1"/></cols><sheetData>${sourceRows}</sheetData><pageMargins left="0.3" right="0.3" top="0.5" bottom="0.5" header="0.2" footer="0.2"/></worksheet>`)
    const report = parseWeeklySpreadsheetRows(rowsToObjects(data, zipSync(files)))
    report.groups[0].vin = 'MK-EDITED'
    const output = unzipSync(new Uint8Array(await (await buildWeeklyWorkbookXlsx(report)).arrayBuffer()))
    const sheet = strFromU8(output['xl/worksheets/sheet1.xml'])
    expect(strFromU8(output['xl/styles.xml'])).toBe(originalStyles)
    expect(sheet).toContain('defaultRowHeight="19"')
    expect(sheet).toContain('width="27"')
    expect(sheet).toContain('<row r="1" ht="32" customHeight="1">')
    expect(sheet).toContain('<row r="2" ht="28" customHeight="1"><c r="A2" s="3"')
    expect(sheet).toContain('<row r="3" ht="40" customHeight="1"><c r="A3" s="5"')
    expect(sheet).toContain('<c r="E2" s="2"><v>0.75</v></c>')
    expect(sheet).toContain('MK-EDITED')
    expect(sheet).toContain('<pageMargins left="0.3"')
    const parsed = await readXlsxFile(Readable.from(Buffer.from(await (await buildWeeklyWorkbookXlsx(report)).arrayBuffer())), { getSheets: true })
    expect(parsed[0].data.slice(1).map(row => row[3])).toEqual([200, 100])
  })

  it('creates knit and woven sheets in Word-image order with rating fills', async () => {
    const report = parseWeeklySpreadsheetRows([
      { VIN: 'MV0002', 'Style Description': 'Slow woven', 'SS Ratio': 4.2, Buyer: 'B' },
      { VIN: 'MK0002', 'Style Description': 'Good knit', 'SS Ratio': 3.4, Buyer: 'A' },
      { VIN: 'MV0001', 'Style Description': 'Great woven', 'SS Ratio': 2.4, Buyer: 'B' },
      { VIN: 'MK0003', 'Style Description': 'Ok knit', 'SS Ratio': 3.8, Buyer: 'A' },
      { VIN: 'MK0001', 'Style Description': 'Great knit', 'SS Ratio': 2.2, Buyer: 'A' },
      { VIN: 'MK0001', 'Style Description': 'Second great knit', 'SS Ratio': 2.4, Buyer: 'A' },
      { VIN: 'MK0004', 'Style Description': 'Middle great knit', 'SS Ratio': 2.3, Buyer: 'A' },
    ], 'weekly.xlsx')

    const blob = await buildWeeklyWorkbookXlsx(report)
    const files = unzipSync(new Uint8Array(await blob.arrayBuffer()))
    const workbook = strFromU8(files['xl/workbook.xml'])
    const knits = strFromU8(files['xl/worksheets/sheet1.xml'])
    const wovens = strFromU8(files['xl/worksheets/sheet2.xml'])
    const styles = strFromU8(files['xl/styles.xml'])

    expect(workbook).toContain('name="Knits"')
    expect(workbook).toContain('name="Wovens"')
    expect(knits.indexOf('MK0001')).toBeGreaterThan(knits.indexOf('MK0002'))
    expect(knits.indexOf('MK0002')).toBeGreaterThan(knits.indexOf('MK0003'))
    expect(wovens.indexOf('MV0001')).toBeGreaterThan(wovens.indexOf('MV0002'))
    expect(knits).toContain('Buyer')
    expect(knits).toContain('s="2"')
    expect(knits).toContain('s="3"')
    expect(knits).toContain('s="4"')
    expect(wovens).toContain('s="5"')
    expect(styles).toContain('rgb="FFC6E0B4"')
    expect(styles).toContain('rgb="FFFFEB9C"')
    expect(styles).toContain('rgb="FFE7E6E6"')
    expect(styles).toContain('rgb="FFFFC7CE"')

    const parsedSheets = await readXlsxFile(Readable.from(Buffer.from(await blob.arrayBuffer())), { getSheets: true })
    const knitRows = parsedSheets.find((sheet) => sheet.sheet === 'Knits').data
    expect(knitRows.map((row) => row[0])).toEqual(['VIN', 'MK0003', 'MK0002', 'MK0001', 'MK0001', 'MK0004'])
  })
})
