export const ansi = {
  reset: '\u001b[0m',
  black: '\u001b[30m',
  red: '\u001b[31m',
  green: '\u001b[32m',
  yellow: '\u001b[33m',
  blue: '\u001b[34m',
  magenta: '\u001b[35m',
  cyan: '\u001b[36m',
  white: '\u001b[37m',
  bBlack: '\u001b[90m',
  bRed: '\u001b[91m',
  bGreen: '\u001b[92m',
  bYellow: '\u001b[93m',
  bBlue: '\u001b[94m',
  bMagenta: '\u001b[95m',
  bCyan: '\u001b[96m',
  bWhite: '\u001b[97m',
  blackBg: '\u001b[40m',
  redBg: '\u001b[41m',
  greenBg: '\u001b[42m',
  yellowBg: '\u001b[43m',
  blueBg: '\u001b[44m',
  magentaBg: '\u001b[45m',
  cyanBg: '\u001b[46m',
  whiteBg: '\u001b[47m'
}

export const ansiEsc = {
  reset: '\\u001b[0m',
  black: '\\u001b[30m',
  red: '\\u001b[31m',
  green: '\\u001b[32m',
  yellow: '\\u001b[33m',
  blue: '\\u001b[34m',
  magenta: '\\u001b[35m',
  cyan: '\\u001b[36m',
  white: '\\u001b[37m',
  bBlack: '\\u001b[90m',
  bRed: '\\u001b[91m',
  bGreen: '\\u001b[92m',
  bYellow: '\\u001b[93m',
  bBlue: '\\u001b[94m',
  bMagenta: '\\u001b[95m',
  bCyan: '\\u001b[96m',
  bWhite: '\\u001b[97m',
  blackBg: '\\u001b[40m',
  redBg: '\\u001b[41m',
  greenBg: '\\u001b[42m',
  yellowBg: '\\u001b[43m',
  blueBg: '\\u001b[44m',
  magentaBg: '\\u001b[45m',
  cyanBg: '\\u001b[46m',
  whiteBg: '\\u001b[47m'
}

export function convertAnsi(string){
  return Object.keys(ansi).reduce((s, k) => {
    return s.replace(ansiEsc[k], ansi[k])
  }, string)
}
