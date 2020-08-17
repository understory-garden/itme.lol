import {
  setStringNoLocale, createThing, setThing, addUrl, setUrl, getThing
} from '@itme/solid-client'
import { RDFS } from '@inrupt/vocab-common-rdf'

import { convertAnsi } from '~lib/color'
import adv from '~vocabs/adventure'

import {dispatchOnSubcommand} from './dispatch'

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

function oppositeOfPredicate(directionPredicate){
  switch(directionPredicate){
  case adv.south:
    return adv.north
  case adv.east:
    return adv.west
  case adv.north:
    return adv.south
  case adv.west:
    return adv.east
  case adv.down:
    return adv.up
  case adv.up:
    return adv.down
  }
  return null
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
  otherRoom = setUrl(otherRoom, oppositeOfPredicate(direction), doorFrom)

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

const addDoor = async (_c, [direction, roomUri], {desc}, {sector, saveSector, room, setResult, setActOverride}) => {
  const directionPredicate = directionToPredicate(direction)
  if (directionPredicate) {
    const [thisRoom, doorTo, otherRoom, doorFrom] = addDoorToRooms(
      directionPredicate, room, getThing(sector, roomUri), {desc}
    )

    await saveToSector(sector, saveSector, thisRoom, otherRoom, doorTo, doorFrom)
  } else {
    setResult(`don't know direction ${direction}`)
  }
}

export default ({
  room: addRoom,
  door: addDoor
})
