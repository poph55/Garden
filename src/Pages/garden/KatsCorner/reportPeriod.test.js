import { describe, expect, it } from 'vitest'
import { currentMonthValue, currentWeekValue, formatReportPeriod } from './reportPeriod'

describe('report periods', () => {
  it('formats month and ISO week values for report labels', () => {
    expect(formatReportPeriod('monthly', '2026-09')).toBe('September 2026')
    expect(formatReportPeriod('weekly', '2026-W38')).toBe('Week 38 2026')
  })

  it('creates stable defaults, including ISO year boundaries', () => {
    expect(currentMonthValue(new Date(2026, 8, 14))).toBe('2026-09')
    expect(currentWeekValue(new Date(2021, 0, 1))).toBe('2020-W53')
  })
})
