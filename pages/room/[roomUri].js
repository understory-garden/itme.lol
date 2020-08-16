import { useRouter } from 'next/router'

import { useMyRoomUri } from '~hooks'
import Console from '~components/console'

export default function RoomPage() {
  const router = useRouter()
  const { roomUri } = router.query
  return (
    <Console roomUri={roomUri} />
  )
}
