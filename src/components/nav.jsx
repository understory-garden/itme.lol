import Link from 'next/link'

import { useMyProfile, useWebId, useAuthentication } from 'swrlit'
import { getStringNoLocale, setStringNoLocale } from '@itme/solid-client'

import { FOAF } from '@inrupt/vocab-common-rdf'

export function AuthButton() {
  const { popupLogin, logout } = useAuthentication()
  const webId = useWebId()
  if (webId === undefined) {
    return <div>loading...</div>
  } else if (webId === null) {
    return (
      <button className="focus:outline-none" onClick={() => popupLogin({ popupUri: "/popup.html" })}>
        log in
      </button>
    )
  } else {
    return <button className="outline-none" onClick={() => logout()}>log out</button>
  }
}


export default function Nav() {
  const { profile } = useMyProfile()
  const name = profile && getStringNoLocale(profile, FOAF.name)

  return (
    <nav>
      <ul className="flex justify-between pb-6 pt-2 px-6 text-xs">
        <li>
          {profile && (
            <>hi, {name}</>
          )}
        </li>
        <li>
          <AuthButton />
        </li>
      </ul>
    </nav>
  )
}
