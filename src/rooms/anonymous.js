import { getStringNoLocale, setStringNoLocale, createThing } from '@itme/solid-client'
import { RDFS, RDF } from '@inrupt/vocab-common-rdf'
import adventure from '~vocabs/adventure'
import { createRoom, defaultAct } from './'

function createAnon(){
  const room = createRoom({
    description: "of the hardest things I am the second: who else brings indigo diamonds?"
  })
  async function act(action, context){
    const { setResult } = context
    if (action.startsWith("log in")){
      defaultAct(action, context)
    } else {
      setResult("the void stares back")
    }
  }
  const defaultResult = `without sight or sound you feel a presence urging you to find a way inside`
  return {room, act, defaultResult}
}

export default createAnon()
