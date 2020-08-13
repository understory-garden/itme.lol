import { space } from "rdf-namespaces"
import { getUrl } from "@itme/solid-client";

import { useEnsured, useProfile } from "swrlit"

export function useStorageContainer(webId) {
  const { profile } = useProfile(webId)
  return profile && getUrl(profile, space.storage)
}

export function useAdventureContainerUri(webId, path = 'public') {
  const storageContainer = useStorageContainer(webId)
  return useEnsured(storageContainer && `${storageContainer}${path}/adventure/`)
}
