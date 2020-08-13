import { useThing, useWebId } from "swrlit"

import { useAdventureContainerUri } from "./uris"

export function useMyHero(){
  const webId = useWebId()
  const adventureUri = useAdventureContainerUri(webId)
  const myHeroUri = adventureUri && `${adventureUri}hero.ttl#me`
  const {thing: hero, ...rest} = useThing(myHeroUri)
  return {hero, ...rest}
}

export function useMyRoom(){
  const webId = useWebId()
  const adventureUri = useAdventureContainerUri(webId)
  const myRoomUri = adventureUri && `${adventureUri}index.ttl#entryway`
  const {thing: room, ...rest} = useThing(myRoomUri)
  return {room, ...rest}
}
