import { useEffect, useMemo, useReducer, useState } from 'react'
import { assignImage, associateImages, createImageAssets, parseSpreadsheetRows, scoreImageCandidate } from './reportModel'
import { readSpreadsheet } from './spreadsheet'
import './FileWorkspace.css'
import './FileWorkspaceSimplified.css'

const initialState = { report: null, assets: [], imageFolderName: '', selectedGroupId: null, status: '', error: '' }
const CANDIDATE_BATCH_SIZE = 120
const EMPTY_CANDIDATES = []
const EMPTY_ASSIGNMENTS = {}

function reducer(state, action) {
  if (action.type === 'report') return { ...state, report: associateImages(action.report, state.assets), selectedGroupId: action.report.groups[0]?.id ?? null, status: '', error: '' }
  if (action.type === 'assets') return { ...state, assets: action.assets, imageFolderName: action.folderName, report: state.report ? associateImages(state.report, action.assets) : null, status: '', error: '' }
  if (action.type === 'select') return { ...state, selectedGroupId: action.id }
  if (action.type === 'assign') return { ...state, report: { ...state.report, groups: state.report.groups.map((group) => group.id === action.groupId ? assignImage(group, action.styleId, action.imageId) : group) } }
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
  const [state, dispatch] = useReducer(reducer, initialState)
  const [exporting, setExporting] = useState(false)
  const [visibleCandidateCount, setVisibleCandidateCount] = useState(CANDIDATE_BATCH_SIZE)
  const [objectUrls, setObjectUrls] = useState(() => new Map())
  const selectedGroup = state.report?.groups.find((group) => group.id === state.selectedGroupId) ?? null
  const candidates = selectedGroup?.candidates ?? EMPTY_CANDIDATES
  const assignments = selectedGroup?.assignments ?? EMPTY_ASSIGNMENTS
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

  useEffect(() => {
    const nextUrls = new Map(previewAssets.map((asset) => [asset.id, URL.createObjectURL(asset.file)]))
    setObjectUrls(nextUrls)
    return () => nextUrls.forEach((url) => URL.revokeObjectURL(url))
  }, [previewAssets])

  useEffect(() => setVisibleCandidateCount(CANDIDATE_BATCH_SIZE), [state.selectedGroupId])

  async function handleSpreadsheet(event) {
    const file = event.target.files?.[0]
    if (!file) return
    try { dispatch({ type: 'report', report: parseSpreadsheetRows(await readSpreadsheet(file), file.name) }) }
    catch (error) { dispatch({ type: 'error', message: error instanceof Error ? error.message : 'Could not read that spreadsheet.' }) }
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

  async function handleExport() {
    if (!state.report) return
    setExporting(true)
    try { const { exportMonthlyReport } = await import('./exportReport'); await exportMonthlyReport(state.report) }
    catch (error) { dispatch({ type: 'error', message: error instanceof Error ? error.message : 'Export failed.' }) }
    finally { setExporting(false) }
  }

  return <main className="file-workspace">
    <section className="import-grid">
      <label className={`drop-card ${state.report ? 'uploaded' : ''}`}><span className="upload-status">{state.report ? '✓ Spreadsheet uploaded' : 'Sales spreadsheet'}</span><strong>{state.report?.sourceName ?? 'Choose CSV or Excel'}</strong><small>{state.report ? 'Click to replace' : 'CSV or XLSX'}</small><input type="file" accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={handleSpreadsheet}/></label>
      <label className={`drop-card ${state.assets.length ? 'uploaded' : ''}`}><span className="upload-status">{state.assets.length ? '✓ Image folder uploaded' : 'Product images'}</span><strong>{state.imageFolderName || 'Choose image folder'}</strong><small>{state.assets.length ? `${state.assets.length.toLocaleString()} images · Click to replace` : 'Subfolders included'}</small><input type="file" accept="image/*" webkitdirectory="" multiple onChange={handleDirectory}/></label>
    </section>
    {(state.status || state.error) && <p className={state.error ? 'workspace-message error' : 'workspace-message'} role="status">{state.error || state.status}</p>}
    {state.report && <section className="report-summary"><div><span>{state.report.groups.length}</span> VINs</div><div><span>{state.report.groups.filter((group) => group.classification === 'knit').length}</span> Knits</div><div><span>{state.report.groups.filter((group) => group.classification === 'woven').length}</span> Wovens</div><div><span>{state.report.groups.reduce((sum, group) => sum + group.styles.length, 0)}</span> Styles</div></section>}
    {state.report && <section className="review-shell">
      <nav className="vin-nav" aria-label="VIN groups">{['knit','woven'].map((classification) => <div key={classification}><h2>{classification}s</h2>{state.report.groups.filter((group) => group.classification === classification).map((group) => <button className={group.id === state.selectedGroupId ? 'selected' : ''} key={group.id} onClick={() => dispatch({ type:'select', id:group.id })}><span>{group.vin}</span><small>{Object.keys(group.assignments).length}/{group.styles.length} matched</small></button>)}</div>)}</nav>
      {selectedGroup && <div className="vin-review"><header><p className="eyebrow">{selectedGroup.classification}</p><h2>{selectedGroup.vin}</h2></header>
        <div className="style-list">{selectedGroup.styles.map((style, index) => { const asset = assetMap.get(selectedGroup.assignments[style.id]); const score = asset ? scoreImageCandidate(style, asset) : 0; return <article className={index === 0 ? 'style-card hero' : 'style-card'} key={style.id} onDragOver={(event) => event.preventDefault()} onDrop={(event) => dispatch({ type:'assign', groupId:selectedGroup.id, styleId:style.id, imageId:event.dataTransfer.getData('text/image-id') })}>
          <div className="style-image">{asset && objectUrls.has(asset.id) ? <img src={objectUrls.get(asset.id)} alt=""/> : <span>No image matched</span>}<div className="image-label"><strong>Units {style.units.toLocaleString()}</strong><strong>SS {style.ss}</strong></div></div>
          <div className="style-copy"><p className="rank">#{index + 1} {index === 0 && '· Best seller'}</p><h3>{style.description}</h3><p>{asset?.name ?? 'Select a candidate below'}</p><p className={`confidence score-${score >= 76 ? 'high' : 'low'}`}>{confidenceLabel(score)} · {score}%</p><select aria-label={`Image for ${style.description}`} value={asset?.id ?? ''} onChange={(event) => dispatch({ type:'assign', groupId:selectedGroup.id, styleId:style.id, imageId:event.target.value })}><option value="">Choose image</option>{visibleCandidates.map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.name}</option>)}</select></div>
        </article>})}</div>
        {candidates.length > 0 && <div className="candidate-tray"><h3>Images</h3><p>{visibleCandidates.length.toLocaleString()} of {candidates.length.toLocaleString()}</p><div>{visibleCandidates.map((asset) => <figure key={asset.id} draggable onDragStart={(event) => event.dataTransfer.setData('text/image-id', asset.id)}><img src={objectUrls.get(asset.id)} alt=""/><figcaption>{asset.name}</figcaption></figure>)}</div>{visibleCandidateCount < candidates.length && <button className="candidate-load-more" type="button" onClick={() => setVisibleCandidateCount((count) => count + CANDIDATE_BATCH_SIZE)}>Show 120 more</button>}</div>}
      </div>}
    </section>}
    <section className="export-panel"><h2>Word report</h2><button disabled={!state.report || exporting} onClick={handleExport}>{exporting ? 'Building…' : 'Export .docx'}</button></section>
  </main>
}
