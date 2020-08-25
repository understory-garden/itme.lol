import Link from 'next/link'

import { useMyProfile, useWebId, useAuthentication } from 'swrlit'
import { getStringNoLocale, setStringNoLocale } from '@itme/solid-client'

import { FOAF } from '@inrupt/vocab-common-rdf'

export function AuthButton() {
  const { login, logout, session } = useAuthentication()
  const info = session && session.info
  if (info) {
    if (info.isLoggedIn) {
      return <button className="outline-none" onClick={() => logout()}>log out</button>
    } else {
      return (
        <button className="focus:outline-none" onClick={() => login({popUp: true})}>
          log in
        </button>
      )
    }
  } else {
    return <div>loading...</div>
  }

}


export default function Nav() {
  const webId = useWebId()
  const { profile } = useMyProfile()
  const name = profile && getStringNoLocale(profile, FOAF.name)

  return (
    <nav>
      <ul className="flex justify-between pb-6 pt-2 pr-6 text-xs">
        <li>
          {profile && (
            <a href={webId} target="_blank" rel="noopener noreferrer">{name}</a>
          )}
        </li>
      </ul>
    </nav>
  )
}
