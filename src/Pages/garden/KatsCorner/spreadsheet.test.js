import { describe, expect, it } from 'vitest'
import { rowsToObjects } from './spreadsheet'

describe('rowsToObjects', () => {
  it('finds the report columns below a title row', () => {
    const rows = [
      ['FEBRUARY', null, null, null, null],
      ['VIN', 'Classification', 'Style Description', 'SLS UNITS', 'SS'],
      ['MK0213C', '', '', 14062, 3.6],
      ['', 'Knits', 'UNKNOWN SUNDAY', 7772, 2.8],
    ]

    expect(rowsToObjects(rows)).toEqual([
      { VIN: 'MK0213C', Classification: '', 'Style Description': '', 'SLS UNITS': 14062, SS: 3.6 },
      { VIN: '', Classification: 'Knits', 'Style Description': 'UNKNOWN SUNDAY', 'SLS UNITS': 7772, SS: 2.8 },
    ])
  })
})
