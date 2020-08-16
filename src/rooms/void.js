import { getStringNoLocale, setStringNoLocale, createThing } from '@itme/solid-client'
import { RDFS, RDF } from '@inrupt/vocab-common-rdf'
import adventure from '~vocabs/adventure'

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

export default createTheVoid()
