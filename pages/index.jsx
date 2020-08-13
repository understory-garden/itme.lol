import Nav from '~components/nav'

import { useState } from 'react'
import { useMyProfile, useWebId, useAuthentication } from 'swrlit'
import { getStringNoLocale, setStringNoLocale } from '@itme/solid-client'
import { useMyRoom, useMyHero } from '~hooks'

export default function IndexPage() {
  const { hero, error: heroError, save: saveHero } = useMyHero()
  const { room, error: roomError, save: saveRoom } = useMyRoom()

  return (
    <div className="bg-black w-full h-screen text-gray-500 flex flex-col px-6 pb-6">
      <Nav />
      <div className="flex-grow text-center">
        {heroError ? (
          <>you float in a formless void</>
        ) : (
          roomError ? (
            <>
              You are standing at the end of a road before a small brick building. Around you is a forest. A small stream flows out of the building and down a gully.
            </>
          ) : (
            <>
              You are in an empty room. The walls are blank.
            </>
          )
        )}
      </div>
      <div className="w-full text-lg border-solid border-white border-2 rounded-lg p-1">
        <textarea className="repl w-full bg-black bg-opacity-0 text-3xl p-6 outline-none" autoFocus></textarea>
      </div>
    </div>
  )
}
