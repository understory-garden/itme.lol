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

function defaultAct(action, {setResult}){

}

export default function IndexPage() {
  const { hero, error: heroError, save: saveHero, mutate: mutateHero } = useMyHero()
  const { room, error: roomError, save: saveRoom, mutate: mutateRoom } = useMyRoom()
  const [ input, setInput ] = useState("")
  const [ result, setResult ] = useState()

  const {room: currentRoom, act, defaultResult} = heroError ? (
    theVoid
  ) : (
    roomError ? (
      outside
    ) : (
      {room, act: defaultAct}
    )
  )
  async function execute(command){
    await act(command, {
      hero, saveHero, mutateHero,
      room, saveRoom, mutateRoom,
      result, setResult
    })
  }
  async function onKeyPress(e){
    if (e.key == 'Enter' ) {
      const command = e.target.value && e.target.value.trim()
      if (command){
        await execute(command)
        setInput("")
      }
    }
  }
  return (
    <div className="bg-black w-full h-screen text-gray-500 flex flex-col px-6 pb-6">
      <Nav />
      <div className="flex-grow text-center my-12">
        {currentRoom && <Room room={currentRoom}/>}
      </div>
      <div className="text-center my-12">
        {result || defaultResult}
      </div>
      <div className="w-full text-lg border-solid border-white border-2 rounded-lg p-1">
        <input type="text" value={input} onChange={ e => setInput(e.target.value) }
          onKeyPress={ onKeyPress }
               className="repl w-full bg-black bg-opacity-0 text-3xl p-6 outline-none" autoFocus/>
      </div>
    </div>
  )
}
