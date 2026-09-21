import { describe, expect, it } from 'vitest'
import { applyManualImages, assignImage, associateImages, confirmImage, createImageAssets, formatSs, groupMatchStatus, manualImageKey, parseSpreadsheetRows, parseWeeklySpreadsheetRows, renameVinAndRematch, roundSs, sortStylesBySs, styleNeedsReview, weeklyRating } from './reportModel'

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

  it('rounds and formats every SS value to the nearest tenth', () => {
    const report = parseSpreadsheetRows([
      { VIN: 'MK0213C', Classification: '', 'Style Description': '', 'SLS UNITS': 100, SS: 3.49999 },
      { VIN: '', Classification: 'Knits', 'Style Description': 'TEST', 'SLS UNITS': 100, SS: 3.04 },
    ])

    expect(report.groups[0].totalSs).toBe(3.5)
    expect(report.groups[0].styles[0].ss).toBe(3)
    expect(roundSs(3.49999)).toBe(3.5)
    expect(formatSs(3.04)).toBe('3.0')
  })

  it('sorts styles by the lowest SS without mutation', () => {
    const styles = [{ id: 'a', ss: 4, units: 1 }, { id: 'b', ss: 2, units: 1 }]
    expect(sortStylesBySs(styles).map(({ id }) => id)).toEqual(['b', 'a'])
    expect(styles.map(({ id }) => id)).toEqual(['a', 'b'])
  })

  it('orders monthly VINs by total SS within knits and wovens', () => {
    const report = parseSpreadsheetRows([
      { VIN: 'KNIT-HIGH', Classification: '', 'Style Description': '', 'SLS UNITS': 10, SS: 3.8 },
      { VIN: '', Classification: 'Knits', 'Style Description': 'High knit', 'SLS UNITS': 10, SS: 3.8 },
      { VIN: 'WOVEN-LOW', Classification: '', 'Style Description': '', 'SLS UNITS': 10, SS: 2.1 },
      { VIN: '', Classification: 'Wovens', 'Style Description': 'Low woven', 'SLS UNITS': 10, SS: 2.1 },
      { VIN: 'KNIT-LOW', Classification: '', 'Style Description': '', 'SLS UNITS': 10, SS: 2.4 },
      { VIN: '', Classification: 'Knits', 'Style Description': 'Low knit', 'SLS UNITS': 10, SS: 2.4 },
      { VIN: 'WOVEN-HIGH', Classification: '', 'Style Description': '', 'SLS UNITS': 10, SS: 3.6 },
      { VIN: '', Classification: 'Wovens', 'Style Description': 'High woven', 'SLS UNITS': 10, SS: 3.6 },
    ])

    expect(report.groups.map(({ vin }) => vin)).toEqual(['KNIT-LOW', 'KNIT-HIGH', 'WOVEN-LOW', 'WOVEN-HIGH'])
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
    expect(reused.confirmedAssignments[matched.styles[1].id]).toBe(true)
  })

  it('can automatically reuse the best candidate across styles', () => {
    const report = parseSpreadsheetRows(rows)
    const matched = associateImages(report, [
      { id: 'shared', name: 'MK0009.jpg', relativePath: 'knits/MK0009.jpg' },
    ]).groups[0]

    expect(Object.values(matched.assignments)).toEqual(['shared', 'shared'])
  })

  it('summarizes VIN match confidence for navigation highlights', () => {
    const report = parseSpreadsheetRows(rows)
    const emptyGroup = report.groups[0]
    expect(groupMatchStatus(emptyGroup)).toBe('none')

    const highGroup = associateImages(report, [
      { id: 'black', name: 'MK0009_BLACK.jpg', relativePath: 'knits/MK0009_BLACK.jpg', manual: true },
      { id: 'mole', name: 'MK0009_MOLE.jpg', relativePath: 'knits/MK0009_MOLE.jpg', manual: true },
    ]).groups[0]
    expect(groupMatchStatus(highGroup)).toBe('high')

    const partialGroup = { ...highGroup, assignments: { [highGroup.styles[0].id]: 'black' } }
    expect(groupMatchStatus(partialGroup)).toBe('low')
  })

  it('turns low-confidence automatic matches into confirmed matches', () => {
    const report = associateImages(parseSpreadsheetRows(rows), [
      { id: 'generic', name: 'MK0009.jpg', relativePath: 'knits/MK0009.jpg' },
    ])
    const group = report.groups[0]
    expect(groupMatchStatus(group)).toBe('low')

    const confirmed = group.styles.reduce((current, style) => confirmImage(current, style.id), group)
    expect(groupMatchStatus(confirmed)).toBe('high')
    expect(Object.keys(confirmed.confirmedAssignments)).toHaveLength(group.styles.length)
  })

  it('identifies missing and low-confidence styles as actionable', () => {
    const report = associateImages(parseSpreadsheetRows(rows), [
      { id: 'generic', name: 'MK0009.jpg', relativePath: 'knits/MK0009.jpg' },
    ])
    const group = report.groups[0]
    const [firstStyle] = group.styles

    expect(group.styles.every((style) => styleNeedsReview(group, style))).toBe(true)
    expect(styleNeedsReview(confirmImage(group, firstStyle.id), firstStyle)).toBe(false)
    expect(styleNeedsReview({ ...group, assignments: {} }, firstStyle)).toBe(true)
  })

  it('re-runs image matching after a VIN is renamed', () => {
    const assets = [
      { id: 'black', name: 'MK0009_BLACK.jpg', relativePath: 'knits/MK0009_BLACK.jpg' },
      { id: 'replacement', name: 'MK9999_BLACK.jpg', relativePath: 'knits/MK9999_BLACK.jpg' },
    ]
    const report = associateImages(parseSpreadsheetRows(rows), assets)
    const group = report.groups[0]
    const renamed = renameVinAndRematch(group, 'mk9999', assets)

    expect(renamed).toMatchObject({ vin: 'MK9999', originalVin: 'MK0009' })
    expect(renamed.styles.every(({ vin }) => vin === 'MK9999')).toBe(true)
    expect(renamed.candidates.map(({ id }) => id)).toEqual(['replacement'])
    expect(Object.values(renamed.assignments)).toEqual(['replacement', 'replacement'])
  })

  it('clears automatic matches when an edited VIN has no candidates', () => {
    const assets = [{ id: 'black', name: 'MK0009_BLACK.jpg', relativePath: 'knits/MK0009_BLACK.jpg' }]
    const group = associateImages(parseSpreadsheetRows(rows), assets).groups[0]
    const renamed = renameVinAndRematch(group, 'MK9999', assets)

    expect(renamed.candidates).toEqual([])
    expect(renamed.assignments).toEqual({})
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

describe('weekly report model', () => {
  it('keeps every Excel row while using one image for each unique nonempty description', () => {
    const report = parseWeeklySpreadsheetRows([
      { VIN: 'MK1', STYLE_DESCRIPTION: 'Blue', 'SS RATIO': 2, 'SLS UN': 10 },
      { VIN: 'MK1', STYLE_DESCRIPTION: 'Blue', 'SS RATIO': 3, 'SLS UN': 20 },
      { VIN: 'MK1', STYLE_DESCRIPTION: '', 'SS RATIO': 4, 'SLS UN': 30 },
      { VIN: 'MK1 Total', 'SS RATIO': 3.5, 'SLS UN': 60 },
    ])
    expect(report.groups[0].detailRows).toHaveLength(3)
    expect(report.groups[0].styles).toHaveLength(1)
    expect(report.groups[0].styles[0]).toMatchObject({ description: 'Blue', units: 20 })
    expect(report.groups[0].totalRow.sourceRow.VIN).toBe('MK1 Total')
  })

  it('uses VIN total rows for headlines and grouping while retaining individual row statistics', () => {
    const report = parseWeeklySpreadsheetRows([
      { VIN: 'MK0895', STYLE_DESCRIPTION: 'Mole', 'SLS UN': 444, 'SS RATIO': 2.277 },
      { VIN: 'MK0895', STYLE_DESCRIPTION: 'Black', 'SLS UN': 315, 'SS RATIO': 3.817 },
      { VIN: 'MK0895 Total', 'SLS UN': 759, 'SS RATIO': 2.916 },
      { VIN: 'MV2514A', STYLE_DESCRIPTION: 'Bison', 'SLS UN': 157, 'SS RATIO': 2.914 },
      { VIN: 'MV2514A', 'SLS UN': 63, 'SS RATIO': 1.849 },
      { VIN: 'MV2514A Total', 'SLS UN': 220, 'SS RATIO': 2.609 },
    ])
    expect(report.groups).toHaveLength(2)
    expect(report.groups[0]).toMatchObject({ vin: 'MK0895', totalUnits: 759, totalSs: 2.9, classification: 'great' })
    expect(report.groups[0].styles.map(({ units, ss }) => [units, ss])).toEqual([[315, 3.8], [444, 2.3]])
    expect(report.groups[1]).toMatchObject({ vin: 'MV2514A', totalUnits: 220, totalSs: 2.6 })
    expect(report.groups[1].styles.map(({ units, ss }) => [units, ss])).toEqual([[157, 2.9]])
  })

  it('excludes missing and whitespace-only descriptions without changing source totals', () => {
    const rows = [
      { VIN: 'MV2339', 'SLS UN': 152, 'SS RATIO': 2.8 },
      { VIN: 'MV2339', STYLE_DESCRIPTION: '  ', 'SLS UN': 38, 'SS RATIO': 7.6 },
      { VIN: 'MV2339', STYLE_DESCRIPTION: 'Black', 'SLS UN': 105, 'SS RATIO': 3.9 },
      { VIN: 'MV2339 Total', 'SLS UN': 295, 'SS RATIO': 3.4 },
    ]
    const report = associateImages(parseWeeklySpreadsheetRows(rows), [{ id: 'candidate', name: 'MV2339.png' }])
    const group = report.groups[0]
    expect(group.styles).toHaveLength(1)
    expect(group.styles[0]).toMatchObject({ description: 'Black', units: 105, ss: 3.9 })
    expect(group).toMatchObject({ totalUnits: 295, totalSs: 3.4 })
  })

  it('reads SLS UN and totals the styles in each weekly group', () => {
    const report = parseWeeklySpreadsheetRows([
      { VIN: 'MK0895', STYLE_DESCRIPTION: 'Mole', ' SLS UN ': '1,444', 'SS RATIO': 2.3 },
      { VIN: 'MK0895', STYLE_DESCRIPTION: 'Black', 'SLS UN': 315, 'SS RATIO': 2.8 },
      { VIN: 'MK0895', STYLE_DESCRIPTION: 'Ivory', 'SLS UN': 20, 'SS RATIO': 4.5 },
    ])

    expect(report.groups[0].styles.map(({ units }) => units)).toEqual([20, 315, 1444])
    expect(report.groups.map(({ totalUnits }) => totalUnits)).toEqual([1779])
  })

  it('classifies rows by SS Ratio and orders the seller groups', () => {
    const report = parseWeeklySpreadsheetRows([
      { VIN: 'SLOW1', style_description: 'Slow style', 'SS Ratio': '4.1' },
      { VIN: 'OK1', style_description: 'Ok style', 'SS Ratio': '3.6' },
      { VIN: 'GREAT1', style_description: 'Great style', 'SS Ratio': '2.9' },
      { VIN: 'GOOD1', style_description: 'Good style', 'SS Ratio': '3.5' },
    ], 'week-8.xlsx')

    expect(report.type).toBe('weekly')
    expect(report.groups.map(({ classification }) => classification)).toEqual(['slow', 'ok', 'good', 'great'])
    expect(report.groups.map(({ vin }) => vin)).toEqual(['SLOW1', 'OK1', 'GOOD1', 'GREAT1'])
  })

  it('uses complete, gap-free SS thresholds', () => {
    expect([2.9, 3, 3.5, 3.51, 3.55, 4, 4.01, 4.1].map(weeklyRating)).toEqual(['great', 'good', 'good', 'good', 'ok', 'ok', 'ok', 'slow'])
  })

  it('groups duplicate VIN rows while keeping every style', () => {
    const report = parseWeeklySpreadsheetRows([
      { VIN: 'MK0009', 'Style Description': 'Black', 'SS Ratio': 2.5 },
      { VIN: 'MK0009', 'Style Description': 'Ivory', 'SS Ratio': 2.8 },
    ])

    expect(report.groups).toHaveLength(1)
    expect(report.groups[0].styles.map(({ description }) => description)).toEqual(['Ivory', 'Black'])
  })

  it('orders weekly VIN groups by SS descending', () => {
    const report = parseWeeklySpreadsheetRows([
      { VIN: 'GOOD-HIGH', 'Style Description': 'Higher good', 'SS Ratio': 3.5 },
      { VIN: 'GREAT-HIGH', 'Style Description': 'Higher great', 'SS Ratio': 2.9 },
      { VIN: 'GOOD-LOW', 'Style Description': 'Lower good', 'SS Ratio': 3.1 },
      { VIN: 'GREAT-LOW', 'Style Description': 'Lower great', 'SS Ratio': 2.1 },
    ])

    expect(report.groups.map(({ vin }) => vin)).toEqual(['GOOD-HIGH', 'GOOD-LOW', 'GREAT-HIGH', 'GREAT-LOW'])
  })

  it('splits weekly VINs into knits first and wovens second', () => {
    const report = parseWeeklySpreadsheetRows([
      { VIN: 'MV0001', 'Style Description': 'Great woven', 'SS Ratio': 2.1 },
      { VIN: 'MK0002', 'Style Description': 'Slow knit', 'SS Ratio': 4.2 },
      { VIN: 'MV0002', 'Style Description': 'Good woven', 'SS Ratio': 3.2 },
      { VIN: 'MK0001', 'Style Description': 'Great knit', 'SS Ratio': 2.2 },
    ])

    expect(report.groups.map(({ vin, fabric, classification }) => [vin, fabric, classification])).toEqual([
      ['MK0002', 'knit', 'slow'],
      ['MK0001', 'knit', 'great'],
      ['MV0002', 'woven', 'good'],
      ['MV0001', 'woven', 'great'],
    ])
  })

  it('keeps a manually uploaded fallback attached after rematching', () => {
    const report = associateImages(parseSpreadsheetRows(rows), [])
    const style = report.groups[0].styles[0]
    const manual = { id: 'manual-black', name: 'phone-photo.png', file: {}, manual: true }
    const withManual = applyManualImages(report, [{ key: manualImageKey(style), asset: manual }])

    expect(withManual.groups[0].assignments[style.id]).toBe('manual-black')
    expect(withManual.groups[0].candidates).toContainEqual(manual)
  })
})
