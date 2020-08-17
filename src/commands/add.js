import {
  setStringNoLocale, createThing, setThing, addUrl, setUrl, getThing, getUrl
} from '@itme/solid-client'
import { RDFS } from '@inrupt/vocab-common-rdf'

import { convertAnsi } from '~lib/color'
import adv from '~vocabs/adventure'

import {dispatchOnSubcommand} from './dispatch'

const directions = new Set([adv.north, adv.west, adv.south, adv.east, adv.up, adv.down])

function directionToPredicate(direction){
  switch(direction){
  case 'n':
  case 'north':
    return adv.north
  case 'w':
  case 'west':
    return adv.west
  case 's':
  case 'south':
    return adv.south
  case 'e':
  case 'east':
    return adv.east
  case 'u':
  case 'up':
    return adv.up
  case 'd':
  case 'down':
    return adv.down
  }
  return null
}


const oppositeOfPredicate = {
  [adv.south]: adv.north,
  [adv.east]: adv.west,
  [adv.north]: adv.south,
  [adv.west]: adv.east,
  [adv.down]: adv.up,
  [adv.up]: adv.down
}

function pathsThroughWall(direction){
  const back = oppositeOfPredicate[direction]
  const orthogonal = directions
  const paths = []
  for (let d of directions){
    if (!((d === direction) || (d === back))){
      paths.push([d, direction, oppositeOfPredicate[d]])
    }
  }
  return paths
}

function newDoor(fromRoom, toRoom, {desc = "a simple door"}){
  var door = createThing()
  door = setUrl(door, adv.to, toRoom)
  door = setUrl(door, adv.from, fromRoom)
  door = setStringNoLocale(door, RDFS.comment, convertAnsi(desc))
  return door
}

async function saveToSector(sector, saveSector, ...things){
  var updatedSector = sector
  for (const thing of things){
    updatedSector = setThing(updatedSector, thing)
  }
  return saveSector(updatedSector)
}

function addDoorToRooms(direction, thisRoom, otherRoom, {desc}){
  var doorTo = newDoor(thisRoom, otherRoom, {desc})
  var doorFrom = newDoor(otherRoom, thisRoom, {desc})

  thisRoom = setUrl(thisRoom, direction, doorTo)
  otherRoom = setUrl(otherRoom, oppositeOfPredicate[direction], doorFrom)

  return [thisRoom, doorTo, otherRoom, doorFrom]
}

function createNewRoom({name, desc}){
  var room = createThing()
  room = setStringNoLocale(room, RDFS.label, convertAnsi(name || "an empty room"))
  room = setStringNoLocale(room, RDFS.comment,  convertAnsi(desc || "it's boring in here"))
  return room
}

const addRoom = async (_c, [direction], {name, desc, doorDesc}, {sector, saveSector, room, setResult}) => {
  const directionPredicate = directionToPredicate(direction)
  if (directionPredicate){
    const [updatedRoom, doorTo, newRoom, doorFrom] = addDoorToRooms(
      directionPredicate, room, createNewRoom({name, desc}), {desc: doorDesc}
    )

    await saveToSector(sector, saveSector, updatedRoom, newRoom, doorTo, doorFrom)
    setResult('')
  } else {
    setResult(`don't know direction ${direction}`)
  }
}

const addDoorAndSave = async (sector, fromRoom, toRoom, directionPredicate, {desc}, {saveSector}) => {
  const [thisRoom, doorTo, otherRoom, doorFrom] = addDoorToRooms(
    directionPredicate, fromRoom, toRoom, {desc}
  )
  return await saveToSector(sector, saveSector, thisRoom, otherRoom, doorTo, doorFrom)
}

function roomsBeyondWall(sector, room, directionPredicate){
  const rooms = []
  for (let path of pathsThroughWall(directionPredicate)){
    const candidateRoom = path.reduce((r, d) => {
      const doorUrl = r && getUrl(r, d)
      const door = doorUrl && getThing(sector, doorUrl)
      const roomThroughDoorUrl = door && getUrl(door, adv.to)
      return roomThroughDoorUrl && getThing(sector, roomThroughDoorUrl)
    }, room)
    if (candidateRoom) rooms.push(candidateRoom)
  }
  return rooms
}

const addDoor = async (_c, [direction, roomUri], {desc}, {sector, saveSector, room, setResult, setActOverride}) => {
  const directionPredicate = directionToPredicate(direction)
  if (directionPredicate) {
    if (roomUri){
      await addDoorAndSave(sector, room, getThing(sector, roomUri), directionPredicate, {desc}, {saveSector})
    } else {
      const roomThroughTheWall = roomsBeyondWall(sector, room, directionPredicate)[0]
      if (roomThroughTheWall) {
        await addDoorAndSave(sector, room, roomThroughTheWall, directionPredicate, {desc}, {saveSector})
      } else {
        setResult(`can't find a room through the wall to the ${direction}`)
      }
    }
  } else {
    setResult(`don't know direction ${direction}`)
  }
}

export default ({
  room: addRoom,
  door: addDoor
})
