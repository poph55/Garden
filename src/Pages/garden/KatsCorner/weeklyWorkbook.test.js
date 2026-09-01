import { describe, expect, it } from 'vitest'
import { Buffer } from 'node:buffer'
import { Readable } from 'node:stream'
import { strFromU8, unzipSync } from 'fflate'
import readXlsxFile from 'read-excel-file/node'
import { parseWeeklySpreadsheetRows } from './reportModel'
import { buildWeeklyWorkbookXlsx } from './weeklyWorkbook'

describe('buildWeeklyWorkbookXlsx', () => {
  it('creates knit and woven sheets in Word-image order with rating fills', async () => {
    const report = parseWeeklySpreadsheetRows([
      { VIN: 'MV0002', 'Style Description': 'Slow woven', 'SS Ratio': 4.2, Buyer: 'B' },
      { VIN: 'MK0002', 'Style Description': 'Good knit', 'SS Ratio': 3.4, Buyer: 'A' },
      { VIN: 'MV0001', 'Style Description': 'Great woven', 'SS Ratio': 2.4, Buyer: 'B' },
      { VIN: 'MK0003', 'Style Description': 'Ok knit', 'SS Ratio': 3.8, Buyer: 'A' },
      { VIN: 'MK0001', 'Style Description': 'Great knit', 'SS Ratio': 2.2, Buyer: 'A' },
    ], 'weekly.xlsx')

    const blob = await buildWeeklyWorkbookXlsx(report)
    const files = unzipSync(new Uint8Array(await blob.arrayBuffer()))
    const workbook = strFromU8(files['xl/workbook.xml'])
    const knits = strFromU8(files['xl/worksheets/sheet1.xml'])
    const wovens = strFromU8(files['xl/worksheets/sheet2.xml'])
    const styles = strFromU8(files['xl/styles.xml'])

    expect(workbook).toContain('name="Knits"')
    expect(workbook).toContain('name="Wovens"')
    expect(knits.indexOf('MK0001')).toBeLessThan(knits.indexOf('MK0002'))
    expect(knits.indexOf('MK0002')).toBeLessThan(knits.indexOf('MK0003'))
    expect(wovens.indexOf('MV0001')).toBeLessThan(wovens.indexOf('MV0002'))
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
    expect(knitRows.map((row) => row[0])).toEqual(['VIN', 'MK0001', 'MK0002', 'MK0003'])
  })
})
