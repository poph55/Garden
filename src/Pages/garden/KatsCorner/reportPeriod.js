function pad(value) {
  return String(value).padStart(2, '0')
}

export function currentMonthValue(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`
}

export function currentWeekValue(date = new Date()) {
  const monday = startOfWorkweek(new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())))
  return dateValue(monday)
}

export function dateValue(date) {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`
}

export function parseDateValue(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (match) return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])))
  const legacyWeek = /^(\d{4})-W(\d{2})$/.exec(value)
  if (!legacyWeek) return null
  const januaryFourth = new Date(Date.UTC(Number(legacyWeek[1]), 0, 4))
  const firstMonday = startOfWorkweek(januaryFourth)
  firstMonday.setUTCDate(firstMonday.getUTCDate() + (Number(legacyWeek[2]) - 1) * 7)
  return firstMonday
}

export function startOfWorkweek(date) {
  const monday = new Date(date)
  const day = monday.getUTCDay() || 7
  monday.setUTCDate(monday.getUTCDate() - day + 1)
  return monday
}

export function workweekDates(value) {
  const start = parseDateValue(value)
  if (!start) return []
  return Array.from({ length: 5 }, (_, index) => new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate() + index)))
}

export function formatWorkweekRange(value, includeYear = false) {
  const dates = workweekDates(value)
  if (!dates.length) return 'Choose week'
  const short = (date) => `${date.getUTCMonth() + 1}/${date.getUTCDate()}`
  const year = dates[4].getUTCFullYear()
  return `${short(dates[0])} - ${short(dates[4])}${includeYear ? ` ${year}` : ''}`
}

export function formatReportPeriod(mode, value) {
  if (mode === 'weekly') {
    return formatWorkweekRange(value, true)
  }

  const match = /^(\d{4})-(\d{2})$/.exec(value)
  if (!match) return 'Month'
  return `${new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1)))} ${match[1]}`
}
