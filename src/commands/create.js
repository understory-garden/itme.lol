import { ansi } from '~lib/color'

export default ({
  room: async (command, args, options, {setResult}) => {
    setResult(`${ansi.red}TODO${ansi.reset}: implement create room`)
  }
})
