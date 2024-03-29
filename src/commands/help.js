import { defaultCommands } from './index'
import { ansi } from '~lib/color'


const commands = ({
  set: `set: ${ansi.blue}room {name | description}`,
  add: `add: ${ansi.blue}{room | door} <direction>`
})

const hiddenCommands = new Set([
  "attack",
  "delete yourself"
])

export default function help(command, [subcommand], options, { setResult }){
  const subcommandHelp = commands[subcommand]
  if (subcommandHelp){
    setResult(subcommandHelp)
  } else {
    setResult(`commands: ${ansi.blue}${Object.keys(defaultCommands).filter(k => !hiddenCommands.has(k)).join("\n")}`)
  }
}
