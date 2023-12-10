const isProduction = process.env.PROD

const debug = (message: string, ...parameters: any[]) => {
  if (isProduction) return
  console.debug(message, ...parameters)
}

const error = (message: string, ...parameters: any[]) => {
  console.error(message, ...parameters)
}

const warn = (message: string, ...parameters: any[]) => {
  console.warn(message, ...parameters)
}

const LogS = {
  debug,
  error,
  warn,
}

export default LogS
