import { Request, Response, NextFunction } from 'express'
import { CustomError } from './interfaces/error'

export const badRequestHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(err.errorsList)
  if (err.status === 400) {
    res.status(400).send({ message: err.errorsList })
  } else {
    next(err)
  }
}

export const unauthorizedHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err.status === 401) {
    res.status(401).send({ message: 'Unauthorized!' })
  } else {
    next(err)
  }
}

export const notFoundHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err.status === 404) {
    res
      .status(404)
      .send({ message: err.message || 'Resource not found!', success: false })
  } else {
    next(err)
  }
}

export const genericErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("Hey I'm the error middleware here is the error: ", err)
  res.status(500).send({ message: 'Generic Server Error' })
}
