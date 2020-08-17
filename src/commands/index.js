import {  getUrl, getThing } from '@itme/solid-client'
import { dispatchOnSubcommand, dispatchOnCommand } from './dispatch'
import setCommands from '~commands/set'
import addCommands from '~commands/add'
import help from '~commands/help'
import movementCommands from '~commands/move'
import { ansi } from '~lib/color'
import adv from '~vocabs/adventure'

export const defaultCommands = {
  set: dispatchOnSubcommand(setCommands),
  add: dispatchOnSubcommand(addCommands),
  a: dispatchOnSubcommand(addCommands),
  rainbow: (_c, _a, _o, {setResult}) => {
    setResult(`
${ansi.whiteBg}${ansi.black}b${ansi.reset}${ansi.red}r${ansi.green}g${ansi.yellow}y${ansi.blue}b${ansi.magenta}m${ansi.cyan}c${ansi.white}w
${ansi.blackBg}b${ansi.redBg}r${ansi.greenBg}g${ansi.yellowBg}y${ansi.blueBg}b${ansi.magentaBg}m${ansi.cyanBg}c${ansi.black}${ansi.whiteBg}w
${ansi.reset}
${ansi.whiteBg}${ansi.bBlack}b${ansi.reset}${ansi.bRed}r${ansi.bGreen}g${ansi.bYellow}y${ansi.bBlue}b${ansi.bMagenta}m${ansi.bCyan}c${ansi.bWhite}w

`)
  },
  ...movementCommands,
  help
}

export default dispatchOnCommand(defaultCommands)
