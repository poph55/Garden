function pad(value) {
  return String(value).padStart(2, '0')
}

export function currentMonthValue(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`
}

export function currentWeekValue(date = new Date()) {
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = utcDate.getUTCDay() || 7
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day)
  const year = utcDate.getUTCFullYear()
  const yearStart = new Date(Date.UTC(year, 0, 1))
  const week = Math.ceil((((utcDate - yearStart) / 86400000) + 1) / 7)
  return `${year}-W${pad(week)}`
}

export function formatReportPeriod(mode, value) {
  if (mode === 'weekly') {
    const match = /^(\d{4})-W(\d{2})$/.exec(value)
    return match ? `Week ${Number(match[2])} ${match[1]}` : 'Week'
  }

  const match = /^(\d{4})-(\d{2})$/.exec(value)
  if (!match) return 'Month'
  return `${new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1)))} ${match[1]}`
}
