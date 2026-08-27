import { useEffect, useMemo, useReducer, useState } from 'react'
import { WEEKLY_RATINGS, applyManualImages, assignImage, associateImages, confirmImage, createImageAssets, groupMatchStatus, manualImageKey, parseSpreadsheetRows, parseWeeklySpreadsheetRows, renameVinAndRematch, scoreImageCandidate } from './reportModel'
import { readSpreadsheet } from './spreadsheet'
import './FileWorkspace.css'
import './FileWorkspaceSimplified.css'

const initialState = { report: null, assets: [], manualImages: [], imageFolderName: '', selectedGroupId: null, status: '', error: '' }
const CANDIDATE_BATCH_SIZE = 120
const EMPTY_CANDIDATES = []
const EMPTY_ASSIGNMENTS = {}
const REPORT_MODES = ['monthly', 'weekly']

function reducer(state, action) {
  if (action.type === 'report') return { ...state, report: applyManualImages(associateImages(action.report, state.assets), state.manualImages), selectedGroupId: action.report.groups[0]?.id ?? null, status: '', error: '' }
  if (action.type === 'assets') return { ...state, assets: action.assets, imageFolderName: action.folderName, report: state.report ? applyManualImages(associateImages(state.report, action.assets), state.manualImages) : null, status: '', error: '' }
  if (action.type === 'manual-image') {
    const manualImages = [...state.manualImages.filter((entry) => entry.key !== action.entry.key), action.entry]
    return { ...state, manualImages, report: applyManualImages(state.report, manualImages), status: '', error: '' }
  }
  if (action.type === 'select') return { ...state, selectedGroupId: action.id }
  if (action.type === 'assign') return { ...state, report: { ...state.report, groups: state.report.groups.map((group) => group.id === action.groupId ? assignImage(group, action.styleId, action.imageId) : group) } }
  if (action.type === 'confirm-image') return { ...state, report: { ...state.report, groups: state.report.groups.map((group) => group.id === action.groupId ? confirmImage(group, action.styleId) : group) }, status: 'Image confirmed.', error: '' }
  if (action.type === 'rename-vin') return { ...state, report: { ...state.report, groups: state.report.groups.map((group) => group.id === action.groupId ? renameVinAndRematch(group, action.vin, state.assets) : group) }, status: 'VIN updated and images re-matched.', error: '' }
  if (action.type === 'status') return { ...state, status: action.message, error: '' }
  if (action.type === 'error') return { ...state, error: action.message, status: '' }
  return state
}

function confidenceLabel(score) {
  if (score >= 76) return 'Strong match'
  if (score >= 60) return 'VIN match'
  return 'Needs review'
}

export default function FileWorkspace() {
  const [reportMode, setReportMode] = useState('monthly')
  const [monthlyState, dispatchMonthly] = useReducer(reducer, initialState)
  const [weeklyState, dispatchWeekly] = useReducer(reducer, initialState)
  const [exporting, setExporting] = useState(false)
  const [visibleCandidateCount, setVisibleCandidateCount] = useState(CANDIDATE_BATCH_SIZE)
  const [objectUrls, setObjectUrls] = useState(() => new Map())
  const state = reportMode === 'weekly' ? weeklyState : monthlyState
  const dispatch = reportMode === 'weekly' ? dispatchWeekly : dispatchMonthly
  const reportModeLabel = reportMode === 'weekly' ? 'Weekly' : 'Monthly'
  const selectedGroup = state.report?.groups.find((group) => group.id === state.selectedGroupId) ?? null
  const candidates = selectedGroup?.candidates ?? EMPTY_CANDIDATES
  const assignments = selectedGroup?.assignments ?? EMPTY_ASSIGNMENTS
  const allImagesConfirmed = state.report?.groups.every((group) => group.styles.every((style) => group.assignments[style.id])) ?? false
  const assetMap = useMemo(() => new Map(candidates.map((asset) => [asset.id, asset])), [candidates])
  const visibleCandidates = useMemo(() => candidates.slice(0, visibleCandidateCount), [candidates, visibleCandidateCount])
  const previewAssets = useMemo(() => {
    const assetsById = new Map(visibleCandidates.map((asset) => [asset.id, asset]))
    for (const imageId of Object.values(assignments)) {
      const asset = assetMap.get(imageId)
      if (asset) assetsById.set(asset.id, asset)
    }
    return [...assetsById.values()]
  }, [assetMap, assignments, visibleCandidates])
  const classifications = reportMode === 'weekly' ? WEEKLY_RATINGS : ['knit', 'woven']
  const summaryItems = useMemo(() => {
    if (!state.report) return []
    if (reportMode === 'weekly') {
      return WEEKLY_RATINGS.map((rating) => ({ label: rating, value: state.report.groups.reduce((count, group) => count + (group.classification === rating ? group.styles.length : 0), 0) }))
    }
    return [
      { label: 'VINs', value: state.report.groups.length },
      { label: 'Knits', value: state.report.groups.filter((group) => group.classification === 'knit').length },
      { label: 'Wovens', value: state.report.groups.filter((group) => group.classification === 'woven').length },
      { label: 'Styles', value: state.report.groups.reduce((sum, group) => sum + group.styles.length, 0) },
    ]
  }, [reportMode, state.report])

  useEffect(() => {
    const nextUrls = new Map(previewAssets.map((asset) => [asset.id, URL.createObjectURL(asset.file)]))
    setObjectUrls(nextUrls)
    return () => nextUrls.forEach((url) => URL.revokeObjectURL(url))
  }, [previewAssets])

  useEffect(() => setVisibleCandidateCount(CANDIDATE_BATCH_SIZE), [state.selectedGroupId])

  async function handleSpreadsheet(event) {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const rows = await readSpreadsheet(file)
      dispatch({ type: 'report', report: createReport(rows, file.name, reportMode) })
    }
    catch (error) { dispatch({ type: 'error', message: error instanceof Error ? error.message : 'Could not read that spreadsheet.' }) }
  }

  function handleReportModeChange(mode) {
    if (mode === reportMode) return
    setReportMode(mode)
  }

  async function handleDirectory(event) {
    const files = event.target.files
    if (!files?.length) return
    const folderName = files[0].webkitRelativePath?.split('/')[0] || 'Selected folder'
    dispatch({ type: 'status', message: `Indexing ${files.length.toLocaleString()} files…` })
    await new Promise((resolve) => setTimeout(resolve, 0))
    const assets = createImageAssets(files)
    dispatch({ type: 'assets', assets, folderName })
  }

  function handleManualImage(event, style) {
    const file = event.target.files?.[0]
    if (!file) return
    const asset = createImageAssets([file])[0]
    if (!asset) {
      dispatch({ type: 'error', message: 'Please choose a supported image file.' })
      return
    }
    dispatch({ type: 'manual-image', entry: { key: manualImageKey(style), asset: { ...asset, manual: true } } })
    event.target.value = ''
  }

  async function handleExport() {
    if (!state.report) return
    setExporting(true)
    try {
      const reportExporter = await import('./exportReport')
      if (reportMode === 'weekly') await reportExporter.exportWeeklyReport(state.report)
      else await reportExporter.exportMonthlyReport(state.report)
    }
    catch (error) { dispatch({ type: 'error', message: error instanceof Error ? error.message : 'Export failed.' }) }
    finally { setExporting(false) }
  }

  return <main className="file-workspace">
    <div className="report-mode-toggle" role="group" aria-label="Report frequency">
      {REPORT_MODES.map((mode) => <button
        aria-pressed={reportMode === mode}
        className={reportMode === mode ? 'selected' : ''}
        key={mode}
        onClick={() => handleReportModeChange(mode)}
        type="button"
      >{mode}</button>)}
    </div>
    <section className="import-grid">
      <label className={`drop-card ${state.report ? 'uploaded' : ''}`}><span className="upload-status">{state.report ? `✓ ${reportModeLabel} spreadsheet uploaded` : `${reportModeLabel} sales spreadsheet`}</span><strong>{state.report?.sourceName ?? 'Choose CSV or Excel'}</strong><small>{state.report ? 'Click to replace' : 'CSV or XLSX'}</small><input type="file" accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={handleSpreadsheet}/></label>
      <label className={`drop-card ${state.assets.length ? 'uploaded' : ''}`}><span className="upload-status">{state.assets.length ? `✓ ${reportModeLabel} image folder uploaded` : `${reportModeLabel} product images`}</span><strong>{state.imageFolderName || 'Choose image folder'}</strong><small>{state.assets.length ? `${state.assets.length.toLocaleString()} images · Click to replace` : 'Subfolders included'}</small><input type="file" accept="image/*" webkitdirectory="" multiple onChange={handleDirectory}/></label>
    </section>
    {(state.status || state.error) && <p className={state.error ? 'workspace-message error' : 'workspace-message'} role="status">{state.error || state.status}</p>}
    {state.report && <section className="report-summary">{summaryItems.map((item) => <div key={item.label}><span>{item.value}</span> {item.label}</div>)}</section>}
    {state.report && <section className="review-shell">
      <nav className="vin-nav" aria-label="VIN groups">{classifications.map((classification) => <div key={classification}><h2>{reportMode === 'weekly' ? classification : `${classification}s`}</h2>{state.report.groups.filter((group) => group.classification === classification).map((group) => <button className={`match-${groupMatchStatus(group)} ${group.id === state.selectedGroupId ? 'selected' : ''}`} key={group.id} onClick={() => dispatch({ type:'select', id:group.id })}><span>{group.vin}</span><small>{Object.keys(group.assignments).length}/{group.styles.length} matched</small></button>)}</div>)}</nav>
      {selectedGroup && <div className="vin-review"><header><p className="eyebrow">{selectedGroup.classification}</p><form className="vin-editor" onSubmit={(event) => { event.preventDefault(); dispatch({ type:'rename-vin', groupId:selectedGroup.id, vin:event.currentTarget.elements.vin.value }) }}><label><span>VIN</span><input name="vin" defaultValue={selectedGroup.vin} key={selectedGroup.vin} aria-label="VIN"/></label><button type="submit">Save &amp; re-match</button></form>{selectedGroup.originalVin !== selectedGroup.vin && <p className="vin-edited-badge">Edited from {selectedGroup.originalVin}</p>}</header>
        <div className="style-list">{selectedGroup.styles.map((style, index) => { const asset = assetMap.get(selectedGroup.assignments[style.id]); const score = asset ? scoreImageCandidate(style, asset) : 0; const confirmed = Boolean(selectedGroup.confirmedAssignments?.[style.id] || asset?.manual); const displayedScore = confirmed ? 100 : score; return <article className={index === 0 ? 'style-card hero' : 'style-card'} key={style.id} onDragOver={(event) => event.preventDefault()} onDrop={(event) => dispatch({ type:'assign', groupId:selectedGroup.id, styleId:style.id, imageId:event.dataTransfer.getData('text/image-id') })}>
          <div className="style-image">{asset && objectUrls.has(asset.id) ? <img src={objectUrls.get(asset.id)} alt=""/> : <span>No image matched</span>}<div className="image-label">{reportMode === 'monthly' && <strong>Units {style.units.toLocaleString()}</strong>}<strong>{reportMode === 'weekly' ? 'SS Ratio' : 'SS'} {style.ss}</strong></div></div>
          <div className="style-copy"><p className="rank">#{index + 1} {index === 0 && '· Best seller'}</p><h3>{style.description}</h3><p>{asset?.name ?? 'Select a candidate below'}</p><p className={`confidence score-${confirmed || score >= 76 ? 'high' : 'low'}`}>{confirmed ? 'Confirmed' : confidenceLabel(score)} · {displayedScore}%</p><select aria-label={`Image for ${style.description}`} value={asset?.id ?? ''} onChange={(event) => dispatch({ type:'assign', groupId:selectedGroup.id, styleId:style.id, imageId:event.target.value })}><option value="">Choose image</option>{previewAssets.map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.name}</option>)}</select>{asset && !confirmed && score < 76 && <button className="confirm-image-button" type="button" onClick={() => dispatch({ type:'confirm-image', groupId:selectedGroup.id, styleId:style.id })}>Confirm image</button>}<details className="manual-image-fallback"><summary>Can’t find the right image?</summary><label className="manual-image-upload">Upload a specific image<input type="file" accept="image/*" onChange={(event) => handleManualImage(event, style)}/></label></details></div>
        </article>})}</div>
        {candidates.length > 0 && <div className="candidate-tray"><h3>Images</h3><p>{previewAssets.length.toLocaleString()} of {candidates.length.toLocaleString()}</p><div>{previewAssets.map((asset) => <figure key={asset.id} draggable onDragStart={(event) => event.dataTransfer.setData('text/image-id', asset.id)}><img src={objectUrls.get(asset.id)} alt=""/><figcaption>{asset.name}{asset.manual && <span>Uploaded</span>}</figcaption></figure>)}</div>{visibleCandidateCount < candidates.length && <button className="candidate-load-more" type="button" onClick={() => setVisibleCandidateCount((count) => count + CANDIDATE_BATCH_SIZE)}>Show 120 more</button>}</div>}
      </div>}
    </section>}
    <section className="export-panel">
      <h2>{reportMode === 'monthly' ? 'Monthly Word report' : 'Weekly Word report'}</h2>
      <button disabled={!state.report || exporting || (reportMode === 'weekly' && !allImagesConfirmed)} onClick={handleExport}>{exporting ? 'Building…' : reportMode === 'weekly' && !allImagesConfirmed ? 'Confirm all images' : 'Export .docx'}</button>
    </section>
  </main>
}

function createReport(rows, sourceName, reportMode) {
  return reportMode === 'weekly' ? parseWeeklySpreadsheetRows(rows, sourceName) : parseSpreadsheetRows(rows, sourceName)
}
