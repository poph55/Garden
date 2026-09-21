import { strFromU8, unzipSync } from 'fflate'
import { describe, expect, it } from 'vitest'
import { buildMonthlyReportDocx, buildWeeklyReportDocx } from './exportReport'
import { parseWeeklySpreadsheetRows } from './reportModel'

describe('buildMonthlyReportDocx', () => {
  it('packages ordered VIN pages with a monthly footer', async () => {
    const report = {
      id: 'february', sourceName: 'February.xlsx', periodLabel: 'February 2026',
      groups: [{
        id: 'knit-mk0213c', vin: 'MK0213C', classification: 'knit', totalUnits: 14062, totalSs: 3.44,
        candidates: [], assignments: {},
        styles: [
          { id: 'best', vin: 'MK0213C', description: 'UNKNOWN SUNDAY', units: 7772, ss: 2.8 },
          { id: 'next', vin: 'MK0213C', description: 'IVORY BLACK', units: 4721, ss: 3.8 },
        ],
      }],
    }

    const blob = await buildMonthlyReportDocx(report)
    const files = unzipSync(new Uint8Array(await blob.arrayBuffer()))
    const documentXml = strFromU8(files['word/document.xml'])
    const footer = strFromU8(files['word/footer.xml'])
    const relationships = strFromU8(files['word/_rels/document.xml.rels'])

    expect(blob.type).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    expect(Object.keys(files)).toEqual(expect.arrayContaining(['[Content_Types].xml', '_rels/.rels', 'word/document.xml', 'word/footer.xml', 'word/settings.xml']))
    expect(documentXml.indexOf('UNKNOWN SUNDAY')).toBeLessThan(documentXml.indexOf('IVORY BLACK'))
    expect(documentXml).toContain('KNITS - GREAT - MK0213C - TTL UNITS: 14,062 - SS: 3.4')
    expect(documentXml).toContain('w:orient="landscape"')
    expect(documentXml).toContain('<w:tblLayout w:type="fixed"/>')
    expect(documentXml).not.toContain('<w:pageBreakBefore/>')
    expect(documentXml).toContain('<w:footerReference w:type="default" r:id="rIdReportFooter"/>')
    expect(relationships).toContain('Target="footer.xml"')
    expect(footer).toContain('MW Selling Report February 2026 - Knits')
    expect(footer).toContain('w:instr="PAGE"')
    expect(footer).toContain(' of ')
    expect(footer).toContain('w:instr="NUMPAGES"')
  })

  it('adds units and SS as a borderless editable upper-left text box', async () => {
    const imageBytes = new Uint8Array([137, 80, 78, 71])
    const report = {
      id: 'february', sourceName: 'February.xlsx',
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
  it('keeps the source VIN total but omits images for unnamed styles', async () => {
    const report = parseWeeklySpreadsheetRows([
      { VIN: 'MV2514A', STYLE_DESCRIPTION: 'Bison', 'SLS UN': 157, 'SS RATIO': 2.914 },
      { VIN: 'MV2514A', 'SLS UN': 63, 'SS RATIO': 1.849 },
      { VIN: 'MV2514A Total', 'SLS UN': 220, 'SS RATIO': 2.609 },
    ])
    const group = report.groups[0]
    group.candidates = [{ id: 'image', name: 'test.png', file: { arrayBuffer: async () => new Uint8Array([137, 80, 78, 71]).buffer } }]
    for (const style of group.styles) group.assignments[style.id] = 'image'
    const blob = await buildWeeklyReportDocx(report, 'woven')
    const xml = strFromU8(unzipSync(new Uint8Array(await blob.arrayBuffer()))['word/document.xml'])
    expect(xml).toContain('WOVENS - GREAT - MV2514A - TTL UNITS: 220 - SS: 2.6')
    const labels = [...xml.matchAll(/<w:txbxContent>([\s\S]*?)<\/w:txbxContent>/g)].map(match => match[1])
    expect(labels).toHaveLength(1)
    expect(labels[0]).toContain('UNITS: 157')
    expect(labels[0]).toContain('SS: 2.9')
    expect(xml).not.toContain('UNITS: 63')
  })

  it('exports imported SLS UN values in image labels, text fallbacks, and group totals', async () => {
    const report = parseWeeklySpreadsheetRows([
      { VIN: 'MK0895', STYLE_DESCRIPTION: 'Mole', 'SLS UN': 444, 'SS RATIO': 2.3 },
      { VIN: 'MK0895', STYLE_DESCRIPTION: 'Black', 'SLS UN': 315, 'SS RATIO': 2.8 },
    ])
    const group = report.groups[0]
    group.candidates = [{ id: 'image', name: 'MK0895.png', file: { arrayBuffer: async () => new Uint8Array([137, 80, 78, 71]).buffer } }]
    group.assignments[group.styles[0].id] = 'image'
    const blob = await buildWeeklyReportDocx(report, 'knit')
    const xml = strFromU8(unzipSync(new Uint8Array(await blob.arrayBuffer()))['word/document.xml'])

    expect(xml).toContain('TTL UNITS: 759')
    expect(xml).toContain('UNITS: 444')
    expect(xml).toContain('Mole | UNITS: 444')
    expect(xml).not.toContain('UNITS: 0')
  })

  it('uses the monthly landscape layout with a weekly footer', async () => {
    const style = (id, ss) => ({ id, vin: id.toUpperCase(), description: `style ${id}`, units: 0, ss })
    const report = {
      sourceName: 'Week 8.xlsx', periodLabel: 'Week 8 2026',
      groups: [
        { id: 'great', vin: 'MK-GREAT', fabric: 'knit', classification: 'great', totalUnits: 0, totalSs: 2.1, candidates: [], assignments: {}, styles: [style('g1', 2.1), style('g2', 2.2)] },
        { id: 'good', vin: 'MV-GOOD', fabric: 'woven', classification: 'good', totalUnits: 0, totalSs: 3.2, candidates: [], assignments: {}, styles: [style('d1', 3.2)] },
      ],
    }

    const blob = await buildWeeklyReportDocx(report, 'woven')
    const files = unzipSync(new Uint8Array(await blob.arrayBuffer()))
    const documentXml = strFromU8(files['word/document.xml'])
    const footer = strFromU8(files['word/footer.xml'])
    const relationships = strFromU8(files['word/_rels/document.xml.rels'])

    expect(documentXml).not.toContain('MK-GREAT')
    expect(documentXml).toContain('MV-GOOD')
    expect(documentXml).toContain('WOVENS - GOOD - MV-GOOD - TTL UNITS: 0 - SS: 3.2')
    expect(documentXml).toContain('w:orient="landscape"')
    expect(documentXml).toContain('<w:tblLayout w:type="fixed"/>')
    expect(relationships).toContain('Target="footer.xml"')
    expect(footer).toContain('MW Selling Report Week 8 2026 - Woven')
    expect(footer).toContain('w:instr="PAGE"')
    expect(footer).toContain('w:instr="NUMPAGES"')
    expect(files['word/header1.xml']).toBeUndefined()
  })

  it('uses the same editable image labels as the monthly report', async () => {
    const bytes = new Uint8Array([137, 80, 78, 71])
    const style = { id: 'style', vin: 'MK0213', description: 'Black knit', units: 0, ss: 2.79999, rating: 'great' }
    const report = {
      sourceName: 'weekly.xlsx',
      groups: [{
        id: 'group', vin: 'MK0213', classification: 'great', totalUnits: 0, totalSs: 2.8,
        styles: [style], assignments: { style: 'image' },
        candidates: [{ id: 'image', name: 'MK0213.png', file: { arrayBuffer: async () => bytes.buffer } }],
      }],
    }

    const blob = await buildWeeklyReportDocx(report)
    const documentXml = strFromU8(unzipSync(new Uint8Array(await blob.arrayBuffer()))['word/document.xml'])

    expect(documentXml).toContain('KNITS - GREAT - MK0213 - TTL UNITS: 0 - SS: 2.8')
    expect(documentXml).toContain('SS: 2.8')
    expect(documentXml).toContain('<v:textbox')
  })
})
