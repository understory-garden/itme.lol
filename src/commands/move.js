import {  getUrl, getThing } from '@itme/solid-client'
import adv from '~vocabs/adventure'

function move(direction, {room, sector, router, setResult}) {
  const doorUri = getUrl(room, direction)
  if (doorUri){
    const door = getThing(sector, doorUri)
    const roomUri = door && getUrl(door, adv.to)
    router.push("/room/[roomUri]", `/room/${encodeURIComponent(roomUri)}`)
    setResult(``)
  } else {
    setResult(`can't go that way`)
  }
}

export default ({
  n: (_c, _a, _o, context) => {
    move(adv.north, context)
  },
  w: (_c, _a, _o, context) => {
    move(adv.west, context)
  },
  s: (_c, _a, _o, context) => {
    move(adv.south, context)
  },
  e: (_c, _a, _o, context) => {
    move(adv.east, context)
  },
  u: (_c, _a, _o, context) => {
    move(adv.up, context)
  },
  d: (_c, _a, _o, context) => {
    move(adv.down, context)
  }
})
