import { strFromU8, unzipSync } from 'fflate'
import { describe, expect, it } from 'vitest'
import { buildMonthlyReportDocx, buildWeeklyReportDocx } from './exportReport'

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
          totalSs: 3.44,
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
        id: 'knit-mk0009', vin: 'MK0009', classification: 'knit', totalUnits: 6495, totalSs: 2.64,
        candidates: [{ id: 'image', name: 'MK0009.png', file: { arrayBuffer: async () => imageBytes.buffer } }],
        assignments: { best: 'image' },
        styles: [{ id: 'best', vin: 'MK0009', description: 'BLACK', units: 6495, ss: 2.59999 }],
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

describe('buildWeeklyReportDocx', () => {
  it('creates four-up pages without mixing seller ratings', async () => {
    const weeklyStyle = (id, rating, ss) => ({ id, vin: id.toUpperCase(), description: `${rating} style ${id}`, units: 0, ss, rating })
    const report = {
      sourceName: 'Week 8.xlsx',
      groups: [
        { id: 'great', vin: 'MK-GREAT', fabric: 'knit', classification: 'great', candidates: [], assignments: {}, styles: [1, 2, 3, 4, 5].map((id) => weeklyStyle(`g${id}`, 'great', 2 + id / 10)) },
        { id: 'good', vin: 'MK-GOOD', fabric: 'knit', classification: 'good', candidates: [], assignments: {}, styles: [weeklyStyle('d1', 'good', 3.2)] },
        { id: 'slow', vin: 'MK-SLOW', fabric: 'knit', classification: 'slow', candidates: [], assignments: {}, styles: [weeklyStyle('s1', 'slow', 4.19999)] },
        { id: 'woven-great', vin: 'MV-GREAT', fabric: 'woven', classification: 'great', candidates: [], assignments: {}, styles: [weeklyStyle('mv1', 'great', 2.1)] },
      ],
    }

    const blob = await buildWeeklyReportDocx(report)
    const files = unzipSync(new Uint8Array(await blob.arrayBuffer()))
    const documentXml = strFromU8(files['word/document.xml'])
    const headerXml = strFromU8(files['word/header1.xml'])
    const documentRels = strFromU8(files['word/_rels/document.xml.rels'])

    expect(documentXml.match(/<w:br w:type="page"\/>/g)).toHaveLength(4)
    expect(documentXml.match(/>GREAT<\/w:t>/g)).toHaveLength(3)
    expect(documentXml.match(/>GOOD<\/w:t>/g)).toHaveLength(1)
    expect(documentXml.match(/>SLOW<\/w:t>/g)).toHaveLength(1)
    expect(documentXml.indexOf('GREAT')).toBeLessThan(documentXml.indexOf('GOOD'))
    expect(documentXml.indexOf('GOOD')).toBeLessThan(documentXml.indexOf('SLOW'))
    expect(documentXml.indexOf('S1')).toBeLessThan(documentXml.indexOf('MV1'))
    expect(documentXml.match(/>KNITS<\/w:t>/g)).toHaveLength(4)
    expect(documentXml.match(/>WOVENS<\/w:t>/g)).toHaveLength(1)
    expect(documentXml).toContain('SS RATIO: 4.2')
    expect(documentXml).not.toContain('w:orient="landscape"')
    expect(documentXml).toContain('<w:headerReference w:type="default" r:id="rIdWeeklyHeader"/>')
    expect(documentRels).toContain('Target="header1.xml"')
    expect(headerXml).toContain('name="Modern Works logo"')
    expect(headerXml).toContain('<w:jc w:val="center"/>')
    expect(files['word/media/modern-works-logo.png'].byteLength).toBeGreaterThan(1000)
  })

  it('keeps weekly image captions editable and omits the monthly image textbox', async () => {
    const bytes = new Uint8Array([137, 80, 78, 71])
    const style = { id: 'style', vin: 'MK0213', description: 'Black knit', units: 0, ss: 2.79999, rating: 'great' }
    const report = {
      sourceName: 'weekly.xlsx',
      groups: [{
        id: 'group', vin: 'MK0213', classification: 'great', styles: [style], assignments: { style: 'image' },
        candidates: [{ id: 'image', name: 'MK0213.png', file: { arrayBuffer: async () => bytes.buffer } }],
      }],
    }

    const blob = await buildWeeklyReportDocx(report)
    const documentXml = strFromU8(unzipSync(new Uint8Array(await blob.arrayBuffer()))['word/document.xml'])

    expect(documentXml).toContain('MK0213')
    expect(documentXml).toContain('Black knit')
    expect(documentXml).toContain('SS RATIO: 2.8')
    expect(documentXml).not.toContain('<v:textbox')
  })
})
