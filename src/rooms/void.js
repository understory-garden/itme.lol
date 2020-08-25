import { getStringNoLocale, setStringNoLocale, createThing } from '@itme/solid-client'
import { RDFS, RDF } from '@inrupt/vocab-common-rdf'
import adventure from '~vocabs/adventure'
import { createRoom, defaultAct } from './'

function createTheVoid(){
  const room = createRoom({
    name: "the void",
    description: "you float in a formless void"
  })
  async function act(action, context){
    const {saveHero, setResult} = context
    if (action.startsWith("log out")){
      defaultAct(action, context)
    }
    var hero = createThing({name: "me"});
    hero = setStringNoLocale(hero, adventure.firstAction, action)
    await saveHero(hero)
    setResult("")
  }
  const defaultResult = `a voice whispers from somewhere: action creates worlds`
  return {room, act, defaultResult}
}

export default createTheVoid()
