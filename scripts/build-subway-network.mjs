import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const source = process.argv[2]
if (!source) throw new Error('Pass the extracted MTA GTFS directory')

const rows = file => {
  const lines = readFileSync(join(source, file), 'utf8').trim().split(/\r?\n/)
  const parse = line => { const values=[]; let value='',quoted=false; for(let i=0;i<line.length;i++){const char=line[i];if(char==='"'){if(quoted&&line[i+1]==='"'){value+='"';i++}else quoted=!quoted}else if(char===','&&!quoted){values.push(value);value=''}else value+=char}values.push(value);return values }
  const headers=parse(lines.shift())
  return lines.map(line=>Object.fromEntries(parse(line).map((value,index)=>[headers[index],value])))
}

const trips=rows('trips.txt'),tripRoute={},shapeRoutes={}
for(const trip of trips){const route=trip.route_id.replace(/X$/,'');tripRoute[trip.trip_id]=route;(shapeRoutes[trip.shape_id]??=new Set()).add(route)}

const shapePoints={}
for(const point of rows('shapes.txt')) (shapePoints[point.shape_id]??=[]).push({seq:Number(point.shape_pt_sequence),lat:Number(point.shape_pt_lat),lon:Number(point.shape_pt_lon)})
const shapes=[]
for(const [id,points] of Object.entries(shapePoints)){const routes=[...(shapeRoutes[id]||[])];if(!routes.length)continue;points.sort((a,b)=>a.seq-b.seq);const simplified=points.filter((_,index)=>index===0||index===points.length-1||index%4===0).map(point=>[point.lat,point.lon]);shapes.push({id,routes,points:simplified})}

const stopRoutes={}
for(const stop of rows('stop_times.txt')){const route=tripRoute[stop.trip_id],id=stop.stop_id.replace(/[NS]$/,'');if(route)(stopRoutes[id]??=new Set()).add(route)}
const stations=rows('stops.txt').filter(stop=>stop.location_type==='1').map(stop=>({id:stop.stop_id,name:stop.stop_name,lat:Number(stop.stop_lat),lon:Number(stop.stop_lon),routes:[...(stopRoutes[stop.stop_id]||[])]}))

writeFileSync('public/subway-network.json',JSON.stringify({shapes,stations}))
console.log(`${shapes.length} route shapes and ${stations.length} stations written`)
