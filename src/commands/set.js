import { setStringNoLocale } from '@itme/solid-client'
import { RDFS } from '@inrupt/vocab-common-rdf'

import { convertAnsi } from '~lib/color'

import {dispatchOnSubcommand} from './dispatch'

const setRoomDescription = async (_c, _a, _o, {setResult, setActOverride}) => {
  setActOverride(async (newDescription, {room, saveRoom}) => {
    var newRoom = setStringNoLocale(room, RDFS.comment, convertAnsi(newDescription))
    setResult('')
    setActOverride(null)
    await saveRoom(newRoom)
  })

  setResult("what would you like the new room description to be?")
}

const setRoomName = async (_c, _a, _o, {setResult, setActOverride}) => {
  setActOverride(async (newName, {room, saveRoom}) => {
    var newRoom = setStringNoLocale(room, RDFS.label, convertAnsi(newName))
    setResult('')
    setActOverride(null)
    await saveRoom(newRoom)
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
  room: dispatchOnSubcommand(setRoomCommands),
  r: dispatchOnSubcommand(setRoomCommands)
})
