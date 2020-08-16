import { setStringNoLocale, createThing, setThing, addUrl, setUrl } from '@itme/solid-client'
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

const addRoom = async (_c, [direction], {name, desc, doorDesc}, {sector, saveSector, room, setResult, setActOverride}) => {
  const directionPredicate = directionToPredicate(direction)
  if (directionPredicate){
    var newRoom = createThing()
    var updatedRoom = room
    var doorTo = createThing()
    var doorFrom = createThing()

    doorTo = setUrl(doorTo, adv.to, newRoom)
    doorTo = setUrl(doorTo, adv.from, updatedRoom)
    doorTo = setStringNoLocale(doorTo, RDFS.comment, convertAnsi(doorDesc || "a simple door"))

    doorFrom = setUrl(doorFrom, adv.from, newRoom)
    doorFrom = setUrl(doorFrom, adv.to, updatedRoom)
    doorFrom = setStringNoLocale(doorFrom, RDFS.comment, convertAnsi(doorDesc || "a simple door"))

    updatedRoom = setUrl(updatedRoom, directionPredicate, doorTo)
    newRoom = setUrl(newRoom, oppositeOfPredicate(directionPredicate), doorFrom)

    newRoom = setStringNoLocale(newRoom, RDFS.label, convertAnsi(name || "an empty room"))
    newRoom = setStringNoLocale(newRoom, RDFS.comment,  convertAnsi(desc || "it's boring in here"))

    var updatedSector = sector
    updatedSector = setThing(updatedSector, updatedRoom)
    updatedSector = setThing(updatedSector, newRoom)
    updatedSector = setThing(updatedSector, doorTo)
    updatedSector = setThing(updatedSector, doorFrom)

    await saveSector(updatedSector)
    setResult('')
    setActOverride(null)
  } else {
    setResult(`don't know direction ${direction}`)
  }
}

export default ({
  room: addRoom
})
