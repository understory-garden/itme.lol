import { useState, useEffect } from 'react'
import { useMyProfile, useWebId, useAuthentication } from 'swrlit'
import { getStringNoLocale, setStringNoLocale, createThing } from '@itme/solid-client'
import { RDFS, RDF } from '@inrupt/vocab-common-rdf'

import { useMyRoom, useMyHero } from '~hooks'
import Nav from '~components/nav'
import minimist from 'minimist'
import Ansi from "ansi-to-react";

function Room({room}){
  const name = getStringNoLocale(room, RDFS.label)
  const description = getStringNoLocale(room, RDFS.comment)
  return (
    <div className="ansi-white-fg">
      <div className="mb-6">
        <Ansi useClasses>{name}</Ansi>
      </div>
      <Ansi useClasses>
        {description}
      </Ansi>
    </div>
  )
}

const adventure = {
  firstAction: `https://itme.lol/v/adventure#firstAction`
}

function createTheVoid(){
  var room = createThing();
  room = setStringNoLocale(room, RDFS.label, "the void")
  room = setStringNoLocale(room, RDFS.comment, "you float in a formless void")
  async function act(action, {saveHero, setResult}){
    var hero = createThing({name: "me"});
    hero = setStringNoLocale(hero, adventure.firstAction, action)
    await saveHero(hero)
    setResult("")
  }
  const defaultResult = `a voice whispers from somewhere: action creates worlds`
  return {room, act, defaultResult}
}
const theVoid = createTheVoid()

function createOutside(){
  var room = createThing();
  room = setStringNoLocale(room, RDFS.comment, "You are standing at the end of a road before a small brick building. Around you is a forest. A small stream flows out of the building and down a gully.")
  async function act(action, { setResult, saveRoom }){
    switch(action){
    case "look building":
      setResult("you see a plain looking building with no windows and a single door")
      break;
    case "go door":
    case "go building":
    case "enter building":
      var room = createThing({name: "entryway"});
      room = setStringNoLocale(room, RDFS.label, "your room")
      room = setStringNoLocale(room, RDFS.comment, "You stand in an empty room. The walls are blank and there are no exits. You feel a pang of claustrophobia...")
      await saveRoom(room)
      setResult(`you open the door and step through.

a cool shiver runs through your body as you cross the threshold and you are suddenly deeply certain that this is your space.

you hear the door close behind you but when you look back it has disappeared...`)
      break;
    }
  }
  return { room, act }
}
const outside = createOutside()

const dispatchOnSubcommand = (commands) => async (command, args, options, context) => {
  const {setResult} = context
  const [subcommand, ...subcommandArgs] = args
  const subcommandFn = commands[subcommand]
  if (subcommandFn) {
    await subcommandFn(subcommand, subcommandArgs, options, {...context, command})
  } else {
    setResult(`you don't know how to \u001b[34m${command} ${subcommand || ''}`)
  }
}

const ansi = {
  reset: '\u001b[0m',
  black: '\u001b[30m',
  red: '\u001b[31m',
  green: '\u001b[32m',
  yellow: '\u001b[33m',
  blue: '\u001b[34m',
  magenta: '\u001b[35m',
  cyan: '\u001b[36m',
  white: '\u001b[37m',
  bBlack: '\u001b[90m',
  bRed: '\u001b[91m',
  bGreen: '\u001b[92m',
  bYellow: '\u001b[93m',
  bBlue: '\u001b[94m',
  bMagenta: '\u001b[95m',
  bCyan: '\u001b[96m',
  bWhite: '\u001b[97m',
  blackBg: '\u001b[40m',
  redBg: '\u001b[41m',
  greenBg: '\u001b[42m',
  yellowBg: '\u001b[43m',
  blueBg: '\u001b[44m',
  magentaBg: '\u001b[45m',
  cyanBg: '\u001b[46m',
  whiteBg: '\u001b[47m'
}

const createCommands = {
  room: async (command, args, options, {setResult}) => {
    setResult(`${ansi.red}TODO${ansi.reset}: implement create room`)
  }
}

const setDescription = async (_c, _a, _o, {setResult, setActOverride}) => {
  setActOverride(async (newDescription, {room, saveRoom}) => {
    var newRoom = setStringNoLocale(room, RDFS.comment, newDescription)
    await saveRoom(newRoom)
    setResult('')
    setActOverride(null)
  })

  setResult("what would you like the new room description to be?")
}

const setRoomCommands = {
  description: setDescription,
  desc: setDescription,
  d: setDescription
}

const setCommands = {
  room: dispatchOnSubcommand(setRoomCommands)
}

const defaultCommands = {
  create: dispatchOnSubcommand(createCommands),
  set: dispatchOnSubcommand(setCommands),
  rainbow: (_c, _a, _o, {setResult}) => {
    setResult(`
${ansi.whiteBg}${ansi.black}b${ansi.reset}${ansi.red}r${ansi.green}g${ansi.yellow}y${ansi.blue}b${ansi.magenta}m${ansi.cyan}c${ansi.white}w
${ansi.blackBg}b${ansi.redBg}r${ansi.greenBg}g${ansi.yellowBg}y${ansi.blueBg}b${ansi.magentaBg}m${ansi.cyanBg}c${ansi.black}${ansi.whiteBg}w
${ansi.reset}
${ansi.whiteBg}${ansi.bBlack}b${ansi.reset}${ansi.bRed}r${ansi.bGreen}g${ansi.bYellow}y${ansi.bBlue}b${ansi.bMagenta}m${ansi.bCyan}c${ansi.bWhite}w

`)
  }
}

async function defaultAct(action, context){
  const { setResult } = context
  const {_: [command, ...args], ...options} = minimist(action.trim().split(" "))
  const commandFn = defaultCommands[command]
  if (commandFn) {
    await commandFn(command, args, options, context)
  } else {
    setResult(`you don't know how to ${ansi.blue}${command}`)
  }
}

export default function IndexPage() {
  const { hero, error: heroError, save: saveHero, mutate: mutateHero } = useMyHero()
  const { room, error: roomError, save: saveRoom, mutate: mutateRoom } = useMyRoom()
  const [ input, setInput ] = useState("")
  const [ result, setResult ] = useState()
  const [ actOverride, setActOverride] = useState()

  const {room: currentRoom, act, defaultResult} = heroError ? (
    theVoid
  ) : (
    roomError ? (
      outside
    ) : (
      {room, act: actOverride || defaultAct}
    )
  )
  async function execute(command){
    await act(command, {
      hero, saveHero, mutateHero,
      room, saveRoom, mutateRoom,
      result, setResult, setActOverride: (f) => setActOverride(_ => f)
    })
  }
  async function onKeyPress(e){
    if (e.key == 'Enter' ) {
      const command = e.target.value
      if (command){
        await execute(command)
        setInput("")
      }
    }
  }
  return (
    <div className="bg-black w-full h-screen text-gray-500 flex flex-col px-6 pb-6">
      <Nav />
      <div className="flex-grow text-center mb-12">
        {currentRoom && <Room room={currentRoom}/>}
      </div>
      <div className="text-center my-12">
        <Ansi useClasses>
          {result || defaultResult}
        </Ansi>
      </div>
      <div className="w-full text-lg border-solid border-white border-2 rounded-lg p-1">
        <input type="text" value={input} onChange={ e => setInput(e.target.value) }
          onKeyPress={ onKeyPress }
               className="repl w-full bg-black bg-opacity-0 text-3xl p-6 outline-none" autoFocus/>
      </div>
    </div>
  )
}
