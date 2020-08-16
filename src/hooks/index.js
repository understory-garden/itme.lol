import { useThing, useWebId } from "swrlit"

import { useAdventureContainerUri } from "./uris"

export function useMyHero(){
  const webId = useWebId()
  const adventureUri = useAdventureContainerUri(webId)
  const myHeroUri = adventureUri && `${adventureUri}hero.ttl#me`
  const {thing: hero, ...rest} = useThing(myHeroUri)
  return {hero, ...rest}
}

export function useMyRoomUri(){
  const webId = useWebId()
  const adventureUri = useAdventureContainerUri(webId)
  return adventureUri && `${adventureUri}index.ttl#entryway`
}

export function useRoom(roomUri){
  const {thing: room, ...rest} = useThing(roomUri)
  return {room, ...rest}
}

export function useMyRoom(){
  const myRoomUri = useMyRoomUri()
  return useRoom(myRoomUri)
}
