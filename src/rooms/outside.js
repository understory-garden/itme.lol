import { getStringNoLocale, setStringNoLocale, createThing } from '@itme/solid-client'
import { RDFS, RDF } from '@inrupt/vocab-common-rdf'
import { createRoom, defaultAct } from './'
import { ansi } from '~lib/color'

function createOutside(){

  const room = createRoom({
    description: "You are standing at the end of a road before a small brick building. Around you is a forest. A small stream flows out of the building and down a gully."
  })
  async function act(action, context){
    const { setResult, saveRoom } = context
    switch(action){
    case "look":
      setResult("You see a plain looking building with no windows and a single door.")
      break;
    case "look building":
      setResult("You see a plain looking building with no windows and a single door.")
      break;
    case "look forest":
      setResult("The forest looks dark and impenetrable.")
      break;
    case "look road":
      setResult("The road is unremarkable. It seems unlikely to go anywhere interesting.")
      break;
    case "go road":
      setResult("You wander down the road for a spell and see nothing remotely interesting. After a short time you find yourself back where you started. How curious...")
      break;
    case "go forest":
      setResult("You try to find a way through the thick undergrowth in the forest but are unable to make even the slightest amount of progress.")
      break;
    case "go stream":
      setResult("You really don't want to get your shoes wet, and the streambed is filled with sharp rocks.")
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
    case "help":
      setResult(`commands: ${ansi.blue}look go`)
      break;
    default:
      return defaultAct(action, context)
    }
  }
  return { room, act }
}
export default createOutside()
