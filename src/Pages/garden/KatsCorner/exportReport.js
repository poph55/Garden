const encoder = new TextEncoder()
const EMU_PER_INCH = 914400
const PAGE_WIDTH_DXA = 15840
const PAGE_HEIGHT_DXA = 12240
const PAGE_MARGIN_DXA = 504
const TABLE_WIDTH_DXA = 14380
const HERO_COLUMN_DXA = 9740
const TRAY_COLUMN_DXA = TABLE_WIDTH_DXA - HERO_COLUMN_DXA
const WEEKLY_PAGE_WIDTH_DXA = 12240
const WEEKLY_PAGE_HEIGHT_DXA = 15840
const WEEKLY_PAGE_MARGIN_DXA = 720
const WEEKLY_TABLE_WIDTH_DXA = 10800
const WEEKLY_COLUMN_DXA = WEEKLY_TABLE_WIDTH_DXA / 2
const WEEKLY_RATINGS = ['great', 'good', 'ok', 'slow']
const escapeXml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const inchesToEmu = (inches) => Math.round(inches * EMU_PER_INCH)

function run(text, { bold = false, size = 22, color = '231F20' } = {}) {
  return `<w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:b w:val="${bold ? 1 : 0}"/><w:color w:val="${color}"/><w:sz w:val="${size}"/></w:rPr><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r>`
}

function titleParagraph(group) {
  const isGreat = group.totalSs < 3.5
  const rating = isGreat ? 'GREAT' : 'OK'
  const color = isGreat ? '276749' : '7A4A00'
  return `<w:p><w:pPr><w:spacing w:after="80"/><w:keepNext/></w:pPr>${run(`${rating} - ${group.vin} - TTL UNITS: ${group.totalUnits.toLocaleString()} - SS: ${group.totalSs}`, { bold: true, size: 30, color })}</w:p>`
}

function editableImageLabel(id, style, sizeInches) {
  const isHero = sizeInches >= 5
  const isCompact = sizeInches < 2.5
  const inset = isHero ? 0.1 : isCompact ? 0.035 : 0.055
  const width = isHero ? 1.65 : isCompact ? 1.05 : 1.32
  const height = isHero ? 0.7 : isCompact ? 0.5 : 0.58
  const fontSize = isHero ? 20 : isCompact ? 16 : 18
  const lineHeight = isHero ? 240 : isCompact ? 190 : 215
  const labelParagraph = (text) => `<w:p><w:pPr><w:spacing w:before="0" w:after="0" w:line="${lineHeight}" w:lineRule="exact"/></w:pPr>${run(text, { bold: true, size: fontSize })}</w:p>`
  return `<w:r><w:pict><v:shape id="label-${id}" type="#_x0000_t202" style="position:absolute;margin-left:${inset}in;margin-top:${inset}in;width:${width}in;height:${height}in;z-index:251659264;mso-position-horizontal-relative:char;mso-position-vertical-relative:line" filled="f" stroked="f"><v:textbox inset="0,0,0,0"><w:txbxContent>${labelParagraph(`UNITS: ${style.units.toLocaleString()}`)}${labelParagraph(`SS: ${style.ss}`)}</w:txbxContent></v:textbox></v:shape></w:pict></w:r>`
}

function drawing(id, sizeInches, style, { includeLabel = true } = {}) {
  const extent = inchesToEmu(sizeInches)
  const description = style.description
  return `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="0" w:after="0"/></w:pPr>${includeLabel ? editableImageLabel(id, style, sizeInches) : ''}<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${extent}" cy="${extent}"/><wp:docPr id="${id}" name="${escapeXml(description)}" descr="${escapeXml(description)}"/><wp:cNvGraphicFramePr/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="0" name="${escapeXml(description)}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rId${id}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${extent}" cy="${extent}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`
}

function cell(content, width) {
  return `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/><w:vAlign w:val="center"/><w:tcMar><w:top w:w="0" w:type="dxa"/><w:start w:w="60" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:end w:w="60" w:type="dxa"/></w:tcMar></w:tcPr>${content || '<w:p/>'}</w:tc>`
}

function table(rows, columnWidths, width = TABLE_WIDTH_DXA) {
  const grid = columnWidths.map((columnWidth) => `<w:gridCol w:w="${columnWidth}"/>`).join('')
  return `<w:tbl><w:tblPr><w:tblW w:w="${width}" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblInd w:w="0" w:type="dxa"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:start w:w="60" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:end w:w="60" w:type="dxa"/></w:tblCellMar><w:tblBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/></w:tblBorders></w:tblPr><w:tblGrid>${grid}</w:tblGrid>${rows.join('')}</w:tbl>`
}

function tableRow(cells) {
  return `<w:tr><w:trPr><w:cantSplit/></w:trPr>${cells.join('')}</w:tr>`
}

function weeklyTableRow(cells) {
  return `<w:tr><w:trPr><w:cantSplit/><w:trHeight w:val="6100" w:hRule="atLeast"/></w:trPr>${cells.join('')}</w:tr>`
}

function weeklyTitleParagraph(rating) {
  const colors = { great: '276749', good: '2F6B85', ok: '9A6700', slow: '9B2C2C' }
  return `<w:p><w:pPr><w:spacing w:after="100"/><w:keepNext/></w:pPr>${run(rating.toUpperCase(), { bold: true, size: 34, color: colors[rating] })}</w:p>`
}

function weeklyDetails(style) {
  const paragraph = (text, options) => `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="0" w:after="35"/></w:pPr>${run(text, options)}</w:p>`
  return `${paragraph(style.vin, { bold: true, size: 24 })}${paragraph(style.description, { size: 19 })}${paragraph(`SS RATIO: ${style.ss}`, { bold: true, size: 21, color: '4F3240' })}`
}

function pageBreak() {
  return '<w:p><w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr><w:r><w:br w:type="page"/></w:r></w:p>'
}

function imageExtension(name) {
  const ext = name.toLowerCase().match(/\.(png|jpe?g|gif)$/)?.[1] ?? 'png'
  return ext === 'jpg' ? 'jpeg' : ext
}

async function annotateImage(asset) {
  if (typeof document === 'undefined' || !asset?.file) {
    return { bytes: new Uint8Array(await asset.file.arrayBuffer()), extension: imageExtension(asset.name) }
  }

  const url = URL.createObjectURL(asset.file)
  try {
    const image = new Image()
    image.src = url
    await image.decode()
    const size = 1400
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const context = canvas.getContext('2d')
    context.fillStyle = '#eee9e6'
    context.fillRect(0, 0, size, size)
    const scale = Math.min(size / image.naturalWidth, size / image.naturalHeight)
    const width = image.naturalWidth * scale
    const height = image.naturalHeight * scale
    context.drawImage(image, (size - width) / 2, (size - height) / 2, width, height)

    const blob = await new Promise((resolve, reject) => canvas.toBlob((result) => result ? resolve(result) : reject(new Error('Could not prepare report image.')), 'image/jpeg', 0.9))
    return { bytes: new Uint8Array(await blob.arrayBuffer()), extension: 'jpeg' }
  } finally {
    URL.revokeObjectURL(url)
  }
}

export async function buildMonthlyReportDocx(report) {
  const { zipSync } = await import('fflate')
  const files = {}
  const relationships = []
  const body = []
  let imageId = 0

  for (const [groupIndex, group] of report.groups.entries()) {
    body.push(titleParagraph(group))
    const styleDrawings = []
    for (const style of group.styles) {
      const asset = group.candidates.find((candidate) => candidate.id === group.assignments[style.id])
      if (!asset) {
        styleDrawings.push({ style, content: `<w:p><w:pPr><w:jc w:val="center"/></w:pPr>${run(`${style.description} | UNITS: ${style.units.toLocaleString()} | SS: ${style.ss}`, { bold: true, size: 20 })}</w:p>` })
        continue
      }
      imageId += 1
      const prepared = await annotateImage(asset)
      const target = `media/image${imageId}.${prepared.extension}`
      files[`word/${target}`] = prepared.bytes
      relationships.push(`<Relationship Id="rId${imageId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="${target}"/>`)
      styleDrawings.push({ style, imageId })
    }

    const hero = styleDrawings[0]
    const remaining = styleDrawings.slice(1)
    const heroContent = hero?.imageId ? drawing(hero.imageId, 6.5, hero.style) : hero?.content || '<w:p/>'
    const secondarySize = Math.min(3.02, 6.54 / Math.max(1, remaining.length))
    const secondaryContent = remaining.length
      ? remaining.map((item) => item.imageId ? drawing(item.imageId, secondarySize, item.style) : item.content).join('')
      : '<w:p/>'
    body.push(table([tableRow([cell(heroContent, HERO_COLUMN_DXA), cell(secondaryContent, TRAY_COLUMN_DXA)])], [HERO_COLUMN_DXA, TRAY_COLUMN_DXA]))
    if (groupIndex < report.groups.length - 1) body.push('<w:p><w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr><w:r><w:br w:type="page"/></w:r></w:p>')
  }

  files['[Content_Types].xml'] = encoder.encode('<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Default Extension="jpeg" ContentType="image/jpeg"/><Default Extension="gif" ContentType="image/gif"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')
  files['_rels/.rels'] = encoder.encode('<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')
  files['word/_rels/document.xml.rels'] = encoder.encode(`<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${relationships.join('')}</Relationships>`)
  files['word/document.xml'] = encoder.encode(`<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture" xmlns:v="urn:schemas-microsoft-com:vml"><w:body>${body.join('')}<w:sectPr><w:pgSz w:w="${PAGE_WIDTH_DXA}" w:h="${PAGE_HEIGHT_DXA}" w:orient="landscape"/><w:pgMar w:top="${PAGE_MARGIN_DXA}" w:right="${PAGE_MARGIN_DXA}" w:bottom="${PAGE_MARGIN_DXA}" w:left="${PAGE_MARGIN_DXA}" w:header="360" w:footer="360"/></w:sectPr></w:body></w:document>`)

  return new Blob([zipSync(files)], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
}

export async function buildWeeklyReportDocx(report) {
  const { zipSync } = await import('fflate')
  const files = {}
  const relationships = []
  const body = []
  const pages = []
  let imageId = 0

  for (const rating of WEEKLY_RATINGS) {
    const styles = report.groups
      .flatMap((group) => group.styles.map((style) => ({ ...style, group })))
      .filter((style) => (style.rating ?? style.group.classification) === rating)
      .sort((a, b) => a.ss - b.ss || a.vin.localeCompare(b.vin) || a.description.localeCompare(b.description))
    for (let index = 0; index < styles.length; index += 4) pages.push({ rating, styles: styles.slice(index, index + 4) })
  }

  for (const [pageIndex, page] of pages.entries()) {
    body.push(weeklyTitleParagraph(page.rating))
    const cards = []
    for (const style of page.styles) {
      const asset = style.group.candidates.find((candidate) => candidate.id === style.group.assignments[style.id])
      let imageContent = `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="1400" w:after="1400"/></w:pPr>${run('IMAGE NOT CONFIRMED', { bold: true, size: 20, color: '7B6870' })}</w:p>`
      if (asset) {
        imageId += 1
        const prepared = await annotateImage(asset)
        const target = `media/image${imageId}.${prepared.extension}`
        files[`word/${target}`] = prepared.bytes
        relationships.push(`<Relationship Id="rId${imageId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="${target}"/>`)
        imageContent = drawing(imageId, 3.18, style, { includeLabel: false })
      }
      cards.push(imageContent + weeklyDetails(style))
    }
    while (cards.length < 4) cards.push('<w:p/>')
    body.push(table([
      weeklyTableRow([cell(cards[0], WEEKLY_COLUMN_DXA), cell(cards[1], WEEKLY_COLUMN_DXA)]),
      weeklyTableRow([cell(cards[2], WEEKLY_COLUMN_DXA), cell(cards[3], WEEKLY_COLUMN_DXA)]),
    ], [WEEKLY_COLUMN_DXA, WEEKLY_COLUMN_DXA], WEEKLY_TABLE_WIDTH_DXA))
    if (pageIndex < pages.length - 1) body.push(pageBreak())
  }

  files['[Content_Types].xml'] = encoder.encode('<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Default Extension="jpeg" ContentType="image/jpeg"/><Default Extension="gif" ContentType="image/gif"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')
  files['_rels/.rels'] = encoder.encode('<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')
  files['word/_rels/document.xml.rels'] = encoder.encode(`<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${relationships.join('')}</Relationships>`)
  files['word/document.xml'] = encoder.encode(`<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture" xmlns:v="urn:schemas-microsoft-com:vml"><w:body>${body.join('')}<w:sectPr><w:pgSz w:w="${WEEKLY_PAGE_WIDTH_DXA}" w:h="${WEEKLY_PAGE_HEIGHT_DXA}"/><w:pgMar w:top="${WEEKLY_PAGE_MARGIN_DXA}" w:right="${WEEKLY_PAGE_MARGIN_DXA}" w:bottom="${WEEKLY_PAGE_MARGIN_DXA}" w:left="${WEEKLY_PAGE_MARGIN_DXA}" w:header="360" w:footer="360"/></w:sectPr></w:body></w:document>`)

  return new Blob([zipSync(files)], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
}

export async function exportMonthlyReport(report) {
  const blob = await buildMonthlyReportDocx(report)
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${report.sourceName.replace(/\.[^.]+$/, '') || 'monthly-report'}.docx`
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

export async function exportWeeklyReport(report) {
  const blob = await buildWeeklyReportDocx(report)
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${report.sourceName.replace(/\.[^.]+$/, '') || 'weekly-report'}-weekly.docx`
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
