const MLB_API = 'https://statsapi.mlb.com/api'
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const GAME_PATTERN = /^\d{5,10}$/
const VENUE_PATTERN = /^\d{1,5}$/

export async function handler(event) {
  const { resource, date, id } = event.queryStringParameters || {}
  let upstream
  if (resource === 'schedule' && DATE_PATTERN.test(date || '')) upstream = `${MLB_API}/v1/schedule?${new URLSearchParams({ sportId:'1', date, hydrate:'team,linescore,venue' })}`
  else if (resource === 'game' && GAME_PATTERN.test(id || '')) upstream = `${MLB_API}/v1.1/game/${id}/feed/live`
  else if (resource === 'venue' && VENUE_PATTERN.test(id || '')) upstream = `${MLB_API}/v1/venues/${id}?hydrate=fieldInfo`
  else return json(400, { error:'Invalid MLB resource request.' }, 'no-store')

  try {
    const response = await fetch(upstream, { headers:{ Accept:'application/json' }, signal:AbortSignal.timeout(8_000) })
    if (!response.ok) return json(502, { error:'MLB data provider returned an error.' }, 'no-store')
    const body = await response.text()
    const cache = resource === 'game' ? 'public, max-age=10, s-maxage=20, stale-while-revalidate=60' : resource === 'venue' ? 'public, max-age=86400, s-maxage=604800' : 'public, max-age=30, s-maxage=60, stale-while-revalidate=300'
    return { statusCode:200, headers:{ 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':cache }, body }
  } catch { return json(504, { error:'MLB data provider timed out.' }, 'no-store') }
}

function json(statusCode,value,cache){return {statusCode,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':cache},body:JSON.stringify(value)}}
