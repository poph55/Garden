import GtfsRealtimeBindings from 'gtfs-realtime-bindings'
import stations from './subway-stations.json' with { type: 'json' }

const feeds = ['gtfs','gtfs-ace','gtfs-bdfm','gtfs-g','gtfs-jz','gtfs-nqrw','gtfs-l']
const base = 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2F'
const stationIndex = Object.fromEntries(stations.map(station => [station.id, station]))
const bearingBetween = (from, to) => {
  if (!from || !to) return null
  const lat1=from.lat*Math.PI/180,lat2=to.lat*Math.PI/180,delta=(to.lon-from.lon)*Math.PI/180
  return (Math.atan2(Math.sin(delta)*Math.cos(lat2),Math.cos(lat1)*Math.sin(lat2)-Math.sin(lat1)*Math.cos(lat2)*Math.cos(delta))*180/Math.PI+360)%360
}

export default async () => {
  try {
    const responses = await Promise.all(feeds.map(feed => fetch(`${base}${feed}`, { headers: { 'User-Agent': 'Garden Subway Live' } })))
    if (responses.some(response => !response.ok)) throw new Error('MTA feed unavailable')
    const messages = await Promise.all(responses.map(async response => GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(await response.arrayBuffer()))))
    const now = Math.floor(Date.now() / 1000)
    const trains = messages.flatMap(message => message.entity).filter(entity => entity.tripUpdate?.trip?.routeId).map(entity => {
      const trip = entity.tripUpdate.trip
      const updates = entity.tripUpdate.stopTimeUpdate || []
      const next = updates.find(stop => Number(stop.arrival?.time || stop.departure?.time || 0) >= now) || updates[0]
      const stopId = next?.stopId?.replace(/[NS]$/,'')
      const station = stationIndex[stopId]
      const nextIndex = updates.indexOf(next), previousUpdate=updates[nextIndex-1], previousId=previousUpdate?.stopId?.replace(/[NS]$/,''), previous=stationIndex[previousId], followingId = updates[nextIndex+1]?.stopId?.replace(/[NS]$/,''), following = stationIndex[followingId]
      const bearing = previous && station
        ? bearingBetween(previous, station)
        : station && following
          ? bearingBetween(station, following)
          : null
      return { id: entity.id, route: trip.routeId?.replace(/X$/,''), direction: trip.directionId ?? null, bearing, nextStop: station?.name || stopId, arrival: Number(next?.arrival?.time || next?.departure?.time || 0) || null, lat: station?.lat, lon: station?.lon, fromLat: previous?.lat, fromLon: previous?.lon, segmentStart: Number(previousUpdate?.departure?.time || previousUpdate?.arrival?.time || 0) || null, segmentEnd: Number(next?.arrival?.time || next?.departure?.time || 0) || null }
    }).filter(train => train.route)
    const timestamp = Math.max(...messages.map(message => Number(message.header.timestamp || 0)))
    return new Response(JSON.stringify({ trains, timestamp, source: 'MTA GTFS-Realtime' }), { headers: { 'content-type':'application/json', 'cache-control':'public, max-age=15, s-maxage=25', 'access-control-allow-origin':'*' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 503, headers: { 'content-type':'application/json' } })
  }
}
