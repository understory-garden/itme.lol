import { getStringNoLocale, setStringNoLocale, createThing } from '@itme/solid-client'
import { RDFS, RDF } from '@inrupt/vocab-common-rdf'
import minimist from 'minimist'

import adventure from '~vocabs/adventure'
import dispatchCommand from '~commands'

export function createRoom({name, description}){
  var room = createThing();
  if (name)
    room = setStringNoLocale(room, RDFS.label, name)
  if (description)
    room = setStringNoLocale(room, RDFS.comment, description)
  return room
}

export async function defaultAct(action, context){
  const {_: [command, ...args], ...options} = minimist(action.trim().split(" "))
  await dispatchCommand(command, args, options, context)
}
