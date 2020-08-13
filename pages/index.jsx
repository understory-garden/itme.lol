import Nav from '~components/nav'

import { useState, useEffect } from 'react'
import { useMyProfile, useWebId, useAuthentication } from 'swrlit'
import { getStringNoLocale, setStringNoLocale, createThing } from '@itme/solid-client'
import { useMyRoom, useMyHero } from '~hooks'
import { RDFS, RDF } from '@inrupt/vocab-common-rdf'


function Room({room}){
  const name = getStringNoLocale(room, RDFS.label)
  const description = getStringNoLocale(room, RDFS.comment)
  return (
    <div>
      <h1>{name}</h1>
      <p>{description}</p>
    </div>
  )
}

function createTheVoid(){
  var room = createThing();
  room = setStringNoLocale(room, RDFS.label, "the void")
  room = setStringNoLocale(room, RDFS.comment, "you float in a formless void")
  return room
}
const theVoid = createTheVoid()

function createOutside(){
  var room = createThing();
  room = setStringNoLocale(room, RDFS.comment, "You are standing at the end of a road before a small brick building. Around you is a forest. A small stream flows out of the building and down a gully.")
  return room
}
const outside = createOutside()


export default function IndexPage() {
  const { hero, error: heroError, save: saveHero } = useMyHero()
  const { room, error: roomError, save: saveRoom } = useMyRoom()

  const {output, setOutput} = useState()
  function execute(command){
    console.log(command)
  }
  function onKeyPress(e){
    if (e.key == 'Enter' ) {
      execute(e.target.value)
      e.target.value = ""
    }
  }
  const currentRoom = heroError ? (
    theVoid
  ) : (
    roomError ? (
      outside
    ) : (
      room
    )
  )
  console.log(currentRoom)
  return (
    <div className="bg-black w-full h-screen text-gray-500 flex flex-col px-6 pb-6">
      <Nav />
      <div className="flex-grow text-center">
        {currentRoom && <Room room={currentRoom}/>}
      </div>
      <div className="w-full text-lg border-solid border-white border-2 rounded-lg p-1">
      <input type="text" onKeyPress={ onKeyPress }
    className="repl w-full bg-black bg-opacity-0 text-3xl p-6 outline-none" autoFocus/>
      </div>
    </div>
  )
}
