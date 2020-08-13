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
      <button onClick={() => popupLogin({ popupUri: "/popup.html" })}>
        log in
      </button>
    )
  } else {
    return <button onClick={() => logout()}>log out</button>
  }
}


export default function Nav() {
  const { profile } = useMyProfile()
  const name = profile && getStringNoLocale(profile, FOAF.name)

  return (
    <nav>
      <ul className="flex justify-between items-center p-8">
        <li>
          <Link href="/">
            <a className="text-grey-900 no-underline">home</a>
          </Link>
        </li>

        <li>
          {profile && (
            <>hi, {name}</>
          )}
        </li>
        <li>
          <AuthButton />
        </li>
        <ul className="flex justify-between items-center space-x-4">
        </ul>
      </ul>
    </nav>
  )
}
