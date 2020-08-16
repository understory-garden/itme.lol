import { dispatchOnSubcommand, dispatchOnCommand } from './dispatch'
import createCommands from '~commands/create'
import setCommands from '~commands/set'
import addCommands from '~commands/add'
import { ansi } from '~lib/color'

const defaultCommands = {
  create: dispatchOnSubcommand(createCommands),
  set: dispatchOnSubcommand(setCommands),
  add: dispatchOnSubcommand(addCommands),
  rainbow: (_c, _a, _o, {setResult}) => {
    setResult(`
${ansi.whiteBg}${ansi.black}b${ansi.reset}${ansi.red}r${ansi.green}g${ansi.yellow}y${ansi.blue}b${ansi.magenta}m${ansi.cyan}c${ansi.white}w
${ansi.blackBg}b${ansi.redBg}r${ansi.greenBg}g${ansi.yellowBg}y${ansi.blueBg}b${ansi.magentaBg}m${ansi.cyanBg}c${ansi.black}${ansi.whiteBg}w
${ansi.reset}
${ansi.whiteBg}${ansi.bBlack}b${ansi.reset}${ansi.bRed}r${ansi.bGreen}g${ansi.bYellow}y${ansi.bBlue}b${ansi.bMagenta}m${ansi.bCyan}c${ansi.bWhite}w

`)
  }
}

export default dispatchOnCommand(defaultCommands)
