import { getStringNoLocale, setStringNoLocale, createThing, getUrl, getThing } from '@itme/solid-client'
import { RDFS } from '@inrupt/vocab-common-rdf'
import Ansi from "ansi-to-react";
import adv from '~vocabs/adventure'

function directionToName(direction){
  switch(direction){
  case adv.north:
    return '\u001b[34mn\u001b[0morth'
  case adv.west:
    return '\u001b[34mw\u001b[0mest'
  case adv.south:
    return '\u001b[34ms\u001b[0mouth'
  case adv.east:
    return '\u001b[34me\u001b[0mast'
  case adv.up:
    return '\u001b[34mu\u001b[0mp'
  case adv.down:
    return '\u001b[34md\u001b[0mown'
  }
  return null
}

function exitsList(sector, room){
  return [adv.north, adv.west, adv.south, adv.east, adv.up, adv.down].map(
    direction => {
      const exitUri = getUrl(room, direction)
      return exitUri && directionToName(direction)
    }
  ).filter(x => x)
}

export default function Room({room, sector}){
  const name = getStringNoLocale(room, RDFS.label)
  const description = getStringNoLocale(room, RDFS.comment)
  const exits = exitsList(sector, room)
  const exitsDescription = (exits.length > 0) && (
    `You see ${exits.length == 1 ? "an exit" : "exits"} ${exits.join(", ")}`
  )
  return (
    <div className="ansi-white-fg">
      <div className="mb-6">
        <Ansi useClasses>{name}</Ansi>
      </div>
      <div className="mb-3">
        <Ansi useClasses>
          {description}
        </Ansi>
      </div>
      <div>
        <Ansi useClasses>
          {exitsDescription}
        </Ansi>
      </div>
    </div>
  )
}
