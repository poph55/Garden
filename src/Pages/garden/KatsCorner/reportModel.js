/** @typedef {'knit' | 'woven'} Classification */
/** @typedef {{ id: string, vin: string, description: string, units: number, ss: number }} StyleRow */
/** @typedef {{ id: string, file: File, name: string, relativePath: string, searchName: string, searchTokens: Set<string> }} ImageAsset */
/** @typedef {{ id: string, vin: string, classification: Classification, totalUnits: number, totalSs: number, styles: StyleRow[], candidates: ImageAsset[], assignments: Record<string, string> }} VinGroup */
/** @typedef {{ id: string, sourceName: string, groups: VinGroup[] }} MonthlyReport */

const HEADER_ALIASES = {
  vin: ['vin', 'vendor item number', 'item'],
  classification: ['classification', 'class', 'fabric'],
  description: ['style description', 'description', 'style', 'color description'],
  units: ['sls units', 'sales units', 'units', 'unit sales'],
  ss: ['ss', 'ss ratio', 'sell through', 'sell-through'],
}

export const WEEKLY_RATINGS = ['great', 'good', 'ok', 'slow']

const IMAGE_EXTENSIONS = /\.(avif|gif|jpe?g|png|webp)$/i

function normalized(value) {
  return String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function stableId(parts) {
  return parts.map((part) => normalized(part).replace(/\s+/g, '-')).filter(Boolean).join('__')
}

function readValue(row, aliases) {
  const entries = Object.entries(row)
  const match = entries.find(([key]) => aliases.includes(normalized(key)))
  return match?.[1]
}

function numberValue(value) {
  const parsed = Number(String(value ?? '').replace(/[$,%\s]/g, '').replaceAll(',', ''))
  return Number.isFinite(parsed) ? parsed : 0
}

function classificationValue(value) {
  const token = normalized(value)
  if (token.includes('woven')) return 'woven'
  if (token.includes('knit')) return 'knit'
  return null
}

export function parseSpreadsheetRows(rows, sourceName = 'Monthly report') {
  const groups = new Map()
  const totalsByVin = new Map()
  let activeVin = ''
  let activeClassification = null

  rows.forEach((row, rowIndex) => {
    const rawVin = String(readValue(row, HEADER_ALIASES.vin) ?? '').trim()
    const nextClassification = classificationValue(readValue(row, HEADER_ALIASES.classification))
    const description = String(readValue(row, HEADER_ALIASES.description) ?? '').trim()
    if (rawVin) activeVin = rawVin.toUpperCase()
    if (nextClassification) activeClassification = nextClassification
    if (rawVin && !description) {
      totalsByVin.set(activeVin, {
        totalUnits: numberValue(readValue(row, HEADER_ALIASES.units)),
        totalSs: numberValue(readValue(row, HEADER_ALIASES.ss)),
      })
      return
    }
    if (!activeVin || !activeClassification || !description || normalized(description) === 'grand total') return

    const key = `${activeClassification}:${activeVin}`
    if (!groups.has(key)) {
      groups.set(key, {
        id: stableId([activeClassification, activeVin]),
        vin: activeVin,
        originalVin: activeVin,
        classification: activeClassification,
        totalUnits: totalsByVin.get(activeVin)?.totalUnits ?? 0,
        totalSs: totalsByVin.get(activeVin)?.totalSs ?? 0,
        styles: [],
        candidates: [],
        assignments: {},
      })
    }

    groups.get(key).styles.push({
      id: stableId([activeVin, description, rowIndex]),
      vin: activeVin,
      description,
      units: numberValue(readValue(row, HEADER_ALIASES.units)),
      ss: numberValue(readValue(row, HEADER_ALIASES.ss)),
    })
  })

  return {
    id: stableId([sourceName, rows.length]),
    sourceName,
    groups: [...groups.values()]
      .map((group) => ({
        ...group,
        totalUnits: group.totalUnits || group.styles.reduce((sum, style) => sum + style.units, 0),
        totalSs: group.totalSs || group.styles[0]?.ss || 0,
        styles: sortStylesBySs(group.styles),
      }))
      .sort((a, b) => a.classification.localeCompare(b.classification) || a.vin.localeCompare(b.vin)),
  }
}

export function weeklyRating(ss) {
  if (ss < 3) return 'great'
  if (ss <= 3.5) return 'good'
  if (ss <= 4) return 'ok'
  return 'slow'
}

export function parseWeeklySpreadsheetRows(rows, sourceName = 'Weekly report') {
  const groups = new Map()

  rows.forEach((row, rowIndex) => {
    const vin = String(readValue(row, HEADER_ALIASES.vin) ?? '').trim().toUpperCase()
    const description = String(readValue(row, HEADER_ALIASES.description) ?? '').trim()
    const rawSs = readValue(row, HEADER_ALIASES.ss)
    if (!vin || !description || rawSs === undefined || rawSs === null || String(rawSs).trim() === '') return

    const ss = numberValue(rawSs)
    const rating = weeklyRating(ss)
    const key = `${rating}:${vin}`
    if (!groups.has(key)) {
      groups.set(key, {
        id: stableId([rating, vin]),
        vin,
        originalVin: vin,
        classification: rating,
        totalUnits: 0,
        totalSs: ss,
        styles: [],
        candidates: [],
        assignments: {},
        confirmedAssignments: {},
      })
    }

    groups.get(key).styles.push({
      id: stableId([vin, description, ss, rowIndex]),
      vin,
      description,
      units: numberValue(readValue(row, HEADER_ALIASES.units)),
      ss,
      rating,
    })
  })

  const ratingOrder = new Map(WEEKLY_RATINGS.map((rating, index) => [rating, index]))
  return {
    id: stableId([sourceName, 'weekly', rows.length]),
    sourceName,
    type: 'weekly',
    groups: [...groups.values()]
      .map((group) => ({ ...group, styles: sortStylesBySs(group.styles) }))
      .sort((a, b) => ratingOrder.get(a.classification) - ratingOrder.get(b.classification) || a.totalSs - b.totalSs || a.vin.localeCompare(b.vin)),
  }
}

export function sortStylesBySs(styles) {
  return [...styles].sort((a, b) => a.ss - b.ss || b.units - a.units || a.description.localeCompare(b.description))
}

export function scoreImageCandidate(style, asset) {
  const searchName = asset.searchName ?? normalized(asset.name)
  const fileTokens = asset.searchTokens ?? new Set(normalized(asset.relativePath || asset.name).split(' ').filter(Boolean))
  const descriptionTokens = normalized(style.description).split(' ').filter((token) => token.length > 1)
  const vinScore = searchName.includes(normalized(style.vin)) ? 60 : 0
  const tokenScore = descriptionTokens.reduce((score, token) => score + (fileTokens.has(token) ? 8 : 0), 0)
  return Math.min(100, vinScore + tokenScore)
}

export function groupMatchStatus(group) {
  const assetsById = new Map(group.candidates.map((asset) => [asset.id, asset]))
  const matchedStyles = group.styles.filter((style) => group.assignments[style.id])
  if (matchedStyles.length === 0) return 'none'

  const allStrong = matchedStyles.length === group.styles.length && matchedStyles.every((style) => {
    const asset = assetsById.get(group.assignments[style.id])
    return asset && (group.confirmedAssignments?.[style.id] || asset.manual || scoreImageCandidate(style, asset) >= 76)
  })
  return allStrong ? 'high' : 'low'
}

export function rankImageCandidates(style, assets) {
  return assets
    .filter((asset) => (asset.searchName ?? normalized(asset.name)).includes(normalized(style.vin)))
    .map((asset) => ({ asset, score: scoreImageCandidate(style, asset) }))
    .sort((a, b) => b.score - a.score || a.asset.name.localeCompare(b.asset.name))
}

export function associateImages(report, assets) {
  const candidatesByVin = new Map(report.groups.map((group) => [normalized(group.vin), []]))
  for (const asset of assets) {
    const searchName = asset.searchName ?? normalized(asset.name)
    for (const [vin, candidates] of candidatesByVin) {
      if (searchName.includes(vin)) candidates.push(asset)
    }
  }

  return {
    ...report,
    groups: report.groups.map((group) => {
      const candidates = candidatesByVin.get(normalized(group.vin)) ?? []
      const assignments = {}
      group.styles.forEach((style) => {
        let best = null
        for (const asset of candidates) {
          const score = scoreImageCandidate(style, asset)
          if (!best || score > best.score || (score === best.score && asset.name.localeCompare(best.asset.name) < 0)) best = { asset, score }
        }
        if (best) {
          assignments[style.id] = best.asset.id
        }
      })
      return { ...group, candidates, assignments, confirmedAssignments: {} }
    }),
  }
}

export function assignImage(group, styleId, imageId, confirmed = true) {
  const assignments = { ...group.assignments }
  const confirmedAssignments = { ...group.confirmedAssignments }
  if (imageId) assignments[styleId] = imageId
  else delete assignments[styleId]
  if (imageId && confirmed) confirmedAssignments[styleId] = true
  else delete confirmedAssignments[styleId]
  return { ...group, assignments, confirmedAssignments }
}

export function confirmImage(group, styleId) {
  if (!group.assignments[styleId]) return group
  return { ...group, confirmedAssignments: { ...group.confirmedAssignments, [styleId]: true } }
}

export function renameVinAndRematch(group, vin, assets) {
  const nextVin = String(vin ?? '').trim().toUpperCase()
  if (!nextVin) return group

  const updatedGroup = {
    ...group,
    vin: nextVin,
    originalVin: group.originalVin ?? group.vin,
    styles: group.styles.map((style) => ({ ...style, vin: nextVin })),
    candidates: [],
    assignments: {},
    confirmedAssignments: {},
  }
  return associateImages({ groups: [updatedGroup] }, assets).groups[0]
}

export function manualImageKey(style) {
  return `${normalized(style.vin)}::${normalized(style.description)}`
}

export function applyManualImages(report, manualImages) {
  if (!report || !manualImages.length) return report
  const manualByStyle = new Map(manualImages.map((entry) => [entry.key, entry.asset]))
  return {
    ...report,
    groups: report.groups.map((group) => {
      const candidatesById = new Map(group.candidates.map((asset) => [asset.id, asset]))
      const assignments = { ...group.assignments }
      const confirmedAssignments = { ...group.confirmedAssignments }
      for (const style of group.styles) {
        const asset = manualByStyle.get(manualImageKey(style))
        if (!asset) continue
        candidatesById.set(asset.id, asset)
        assignments[style.id] = asset.id
        confirmedAssignments[style.id] = true
      }
      return { ...group, candidates: [...candidatesById.values()], assignments, confirmedAssignments }
    }),
  }
}

export function createImageAssets(files) {
  return Array.from(files)
    .filter((file) => IMAGE_EXTENSIONS.test(file.name))
    .map((file, index) => {
      const relativePath = file.webkitRelativePath || file.name
      return {
        id: stableId([relativePath, file.lastModified, index]),
        file,
        name: file.name,
        relativePath,
        searchName: normalized(file.name),
        searchTokens: new Set(normalized(relativePath).split(' ').filter(Boolean)),
      }
    })
}
