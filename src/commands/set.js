import { setStringNoLocale } from '@itme/solid-client'
import { RDFS } from '@inrupt/vocab-common-rdf'

import { ansi, ansiEsc } from '~lib/color'

import {dispatchOnSubcommand} from './dispatch'

function convertAnsi(string){
  return Object.keys(ansi).reduce((s, k) => {
    return s.replace(ansiEsc[k], ansi[k])
  }, string)
}

const setRoomDescription = async (_c, _a, _o, {setResult, setActOverride}) => {
  setActOverride(async (newDescription, {room, saveRoom}) => {
    var newRoom = setStringNoLocale(room, RDFS.comment, convertAnsi(newDescription))
    await saveRoom(newRoom)
    setResult('')
    setActOverride(null)
  })

  setResult("what would you like the new room description to be?")
}

const setRoomName = async (_c, _a, _o, {setResult, setActOverride}) => {
  setActOverride(async (newName, {room, saveRoom}) => {
    var newRoom = setStringNoLocale(room, RDFS.label, convertAnsi(newName))
    await saveRoom(newRoom)
    setResult('')
    setActOverride(null)
  })

  setResult("what would you like the new room name to be?")
}

const setRoomCommands = {
  description: setRoomDescription,
  desc: setRoomDescription,
  d: setRoomDescription,
  name: setRoomName,
  n: setRoomName,
}

export default ({
  room: dispatchOnSubcommand(setRoomCommands)
})
