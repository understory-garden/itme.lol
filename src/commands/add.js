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

const addRoom = async (_c, [direction], {name, desc, doorDesc}, {sector, saveSector, room, setResult}) => {
  const directionPredicate = directionToPredicate(direction)
  if (directionPredicate){
    var newRoom = createThing()
    newRoom = setStringNoLocale(newRoom, RDFS.label, convertAnsi(name || "an empty room"))
    newRoom = setStringNoLocale(newRoom, RDFS.comment,  convertAnsi(desc || "it's boring in here"))
    var updatedRoom = room

    var doorFrom = newDoor(newRoom, updatedRoom, {desc})
    var doorTo = newDoor(updatedRoom, newRoom, {desc})

    updatedRoom = setUrl(updatedRoom, directionPredicate, doorTo)
    newRoom = setUrl(newRoom, oppositeOfPredicate(directionPredicate), doorFrom)

    await saveToSector(sector, saveSector, updatedRoom, newRoom, doorTo, doorFrom)
    setResult('')
  } else {
    setResult(`don't know direction ${direction}`)
  }
}

const addDoor = async (_c, [direction, roomUri], {name, desc, doorDesc}, {sector, saveSector, room, setResult, setActOverride}) => {
  const directionPredicate = directionToPredicate(direction)
  if (directionPredicate) {
    var thisRoom = room
    var otherRoom = getThing(sector, roomUri)

    var doorFrom = newDoor(otherRoom, thisRoom, {desc})
    var doorTo = newDoor(thisRoom, otherRoom, {desc})

    thisRoom = setUrl(thisRoom, directionPredicate, doorTo)
    otherRoom = setUrl(otherRoom, oppositeOfPredicate(directionPredicate), doorFrom)

    await saveToSector(sector, saveSector, thisRoom, otherRoom, doorTo, doorFrom)
  } else {
    setResult(`don't know direction ${direction}`)
  }
}

export default ({
  room: addRoom,
  door: addDoor
})
