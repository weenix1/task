export interface CustomError extends Error {
  status?: number
  errorsList?: string[]
}
