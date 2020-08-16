import { useState, useEffect } from 'react'
import { useMyProfile, useWebId, useAuthentication } from 'swrlit'
import { getStringNoLocale, setStringNoLocale, createThing, getUrl, getThing } from '@itme/solid-client'
import { RDFS, RDF } from '@inrupt/vocab-common-rdf'
import minimist from 'minimist'
import Ansi from "ansi-to-react";

import { useRoom, useMyHero, useMyRoomUri } from '~hooks'
import Nav from '~components/nav'
import Room from '~components/room'
import dispatchCommand from '~commands'
import theVoid from '~rooms/void'
import outside from '~rooms/outside'
import adv from '~vocabs/adventure'

async function defaultAct(action, context){
  const { setResult } = context
  const {_: [command, ...args], ...options} = minimist(action.trim().split(" "))
  await dispatchCommand(command, args, options, context)
}

export default function Console({roomUri}) {
  const { room, error: roomError, save: saveRoom, mutate: mutateRoom, resource: sector, saveResource: saveSector } = useRoom(roomUri)
  const { hero, error: heroError, save: saveHero, mutate: mutateHero } = useMyHero()
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
      sector, saveSector,
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
    <div className="bg-black w-full h-screen text-gray-500 flex flex-col px-6 pb-6 font-mono">
      <Nav />
      <div className="flex-grow text-center mb-12">
        {currentRoom && <Room room={currentRoom} sector={sector}/>}
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
