import { describe, expect, it } from 'vitest'
import { assignImage, associateImages, createImageAssets, parseSpreadsheetRows, sortStylesBySs } from './reportModel'

const rows = [
  { VIN: 'MK0009', Classification: 'Knits', 'Style Description': 'BLACK', 'SLS UNITS': '6,495', SS: '2.6' },
  { VIN: '', Classification: '', 'Style Description': 'MOLE', 'SLS UNITS': '1,256', SS: '3.6' },
  { VIN: 'MV0824', Classification: 'Wovens', 'Style Description': 'WHITE', 'SLS UNITS': '6,926', SS: '2.7' },
]

describe('monthly report model', () => {
  it('parses flexible rows into classified VIN groups', () => {
    const report = parseSpreadsheetRows(rows, 'february.csv')
    expect(report.groups.map(({ vin, classification }) => [vin, classification])).toEqual([['MK0009', 'knit'], ['MV0824', 'woven']])
    expect(report.groups[0].styles[1].description).toBe('MOLE')
  })

  it('preserves the VIN total row for the report header', () => {
    const report = parseSpreadsheetRows([
      { VIN: 'MK0213C', Classification: '', 'Style Description': '', 'SLS UNITS': '14,062', SS: '3.6' },
      { VIN: '', Classification: 'Knits', 'Style Description': 'UNKNOWN SUNDAY', 'SLS UNITS': '7,772', SS: '2.8' },
    ])

    expect(report.groups[0]).toMatchObject({ totalUnits: 14062, totalSs: 3.6 })
  })

  it('sorts styles by the lowest SS without mutation', () => {
    const styles = [{ id: 'a', ss: 4, units: 1 }, { id: 'b', ss: 2, units: 1 }]
    expect(sortStylesBySs(styles).map(({ id }) => id)).toEqual(['b', 'a'])
    expect(styles.map(({ id }) => id)).toEqual(['a', 'b'])
  })

  it('allows one image to be assigned to multiple styles', () => {
    const report = parseSpreadsheetRows(rows)
    const assets = [
      { id: 'black', name: 'MK0009_BLACK.jpg', relativePath: 'knits/MK0009_BLACK.jpg' },
      { id: 'mole', name: 'MK0009_MOLE.jpg', relativePath: 'knits/MK0009_MOLE.jpg' },
    ]
    const matched = associateImages(report, assets).groups[0]
    expect(matched.assignments[matched.styles[0].id]).toBe('black')
    const reused = assignImage(matched, matched.styles[1].id, 'black')
    expect(reused.assignments[matched.styles[0].id]).toBe('black')
    expect(reused.assignments[matched.styles[1].id]).toBe('black')
  })

  it('can automatically reuse the best candidate across styles', () => {
    const report = parseSpreadsheetRows(rows)
    const matched = associateImages(report, [
      { id: 'shared', name: 'MK0009.jpg', relativePath: 'knits/MK0009.jpg' },
    ]).groups[0]

    expect(Object.values(matched.assignments)).toEqual(['shared', 'shared'])
  })

  it('indexes 50,000 filenames without creating image URLs', () => {
    const files = Array.from({ length: 50000 }, (_, index) => ({
      name: index % 5000 === 0 ? `MK0009_BLACK_${index}.png` : `ARCHIVE_${index}.png`,
      webkitRelativePath: `archive/2026/${index}.png`,
      lastModified: index,
    }))

    const assets = createImageAssets(files)
    const matched = associateImages(parseSpreadsheetRows(rows), assets).groups[0]

    expect(assets).toHaveLength(50000)
    expect(matched.candidates).toHaveLength(10)
    expect(assets[0]).not.toHaveProperty('objectUrl')
  })
})
