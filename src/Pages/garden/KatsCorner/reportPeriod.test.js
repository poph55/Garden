import { describe, expect, it } from 'vitest'
import { currentMonthValue, currentWeekValue, formatReportPeriod, formatWorkweekRange, workweekDates } from './reportPeriod'

describe('report periods', () => {
  it('formats month and ISO week values for report labels', () => {
    expect(formatReportPeriod('monthly', '2026-09')).toBe('September 2026')
    expect(formatReportPeriod('weekly', '2026-09-14')).toBe('9/14 - 9/18 2026')
    expect(formatWorkweekRange('2026-09-14')).toBe('9/14 - 9/18')
    expect(formatWorkweekRange('2026-W38')).toBe('9/14 - 9/18')
  })

  it('creates stable defaults, including ISO year boundaries', () => {
    expect(currentMonthValue(new Date(2026, 8, 14))).toBe('2026-09')
    expect(currentWeekValue(new Date(2021, 0, 1))).toBe('2020-12-28')
    expect(workweekDates('2026-09-14').map((date) => date.getUTCDate())).toEqual([14, 15, 16, 17, 18])
  })
})
