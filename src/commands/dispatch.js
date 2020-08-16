export const dispatchOnCommand = (commands) => async (command, args, options, context) => {
  const { setResult, parentCommand = []} = context
  const commandFn = commands[command]
  if (commandFn) {
    await commandFn(command, args, options, context)
  } else {
    setResult(`you don't know how to \u001b[34m${[...parentCommand, command].join(' ')}`)
  }
}

export const dispatchOnSubcommand = (commands) => {
  const dispatch = dispatchOnCommand(commands)
  return async (command, [subcommand, ...args], options, context) => {
    const { parentCommand = []} = context
    return dispatch(subcommand, args, options, {...context, parentCommand: [...parentCommand, command]})
  }
}
