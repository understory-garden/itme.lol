import { useMyRoomUri } from '~hooks'
import Console from '~components/console'

export default function IndexPage() {
  const roomUri = useMyRoomUri()
  return (
    <Console roomUri={roomUri} />
  )
}
