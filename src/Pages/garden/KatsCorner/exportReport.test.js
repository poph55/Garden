import { strFromU8, unzipSync } from 'fflate'
import { describe, expect, it } from 'vitest'
import { buildMonthlyReportDocx } from './exportReport'

describe('buildMonthlyReportDocx', () => {
  it('packages ordered VIN pages as an editable Word document', async () => {
    const report = {
      id: 'february',
      sourceName: 'February.xlsx',
      groups: [
        {
          id: 'knit-mk0213c',
          vin: 'MK0213C',
          classification: 'knit',
          totalUnits: 14062,
          totalSs: 3.4,
          candidates: [],
          assignments: {},
          styles: [
            { id: 'best', vin: 'MK0213C', description: 'UNKNOWN SUNDAY', units: 7772, ss: 2.8 },
            { id: 'next', vin: 'MK0213C', description: 'IVORY BLACK', units: 4721, ss: 3.8 },
          ],
        },
      ],
    }

    const blob = await buildMonthlyReportDocx(report)
    const files = unzipSync(new Uint8Array(await blob.arrayBuffer()))
    const documentXml = strFromU8(files['word/document.xml'])

    expect(blob.type).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    expect(Object.keys(files)).toEqual(expect.arrayContaining(['[Content_Types].xml', '_rels/.rels', 'word/document.xml']))
    expect(documentXml.indexOf('UNKNOWN SUNDAY')).toBeLessThan(documentXml.indexOf('IVORY BLACK'))
    expect(documentXml).toContain('GREAT - MK0213C - TTL UNITS: 14,062 - SS: 3.4')
    expect(documentXml).toContain('w:orient="landscape"')
    expect(documentXml).toContain('<w:tblLayout w:type="fixed"/>')
    expect(documentXml).not.toContain('<w:pageBreakBefore/>')
    expect(documentXml).not.toContain('KNIT')
  })

  it('adds units and SS as a borderless editable upper-left text box', async () => {
    const imageBytes = new Uint8Array([137, 80, 78, 71])
    const report = {
      id: 'february',
      sourceName: 'February.xlsx',
      groups: [{
        id: 'knit-mk0009', vin: 'MK0009', classification: 'knit', totalUnits: 6495, totalSs: 2.6,
        candidates: [{ id: 'image', name: 'MK0009.png', file: { arrayBuffer: async () => imageBytes.buffer } }],
        assignments: { best: 'image' },
        styles: [{ id: 'best', vin: 'MK0009', description: 'BLACK', units: 6495, ss: 2.6 }],
      }],
    }

    const blob = await buildMonthlyReportDocx(report)
    const documentXml = strFromU8(unzipSync(new Uint8Array(await blob.arrayBuffer()))['word/document.xml'])

    expect(documentXml).toContain('<v:textbox')
    expect(documentXml).toContain('<w:txbxContent>')
    expect(documentXml).toContain('margin-left:0.1in;margin-top:0.1in')
    expect(documentXml).toContain('filled="f" stroked="f"')
    expect(documentXml).toContain('UNITS: 6,495')
    expect(documentXml).toContain('SS: 2.6')
  })
})
