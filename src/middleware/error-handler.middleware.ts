import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import DataBaseError from '../models/errors/database.error.model'
import ForbiddenError from '../models/errors/forbidden.error.model'

function errorHandler (error: any, req: Request, res: Response, next: NextFunction) {
  if (error instanceof DataBaseError) {
    return res.status(StatusCodes.BAD_REQUEST).json({ Error: error.message })
  } else if (error instanceof ForbiddenError) {
    return res.status(StatusCodes.FORBIDDEN).json({ Error: error.message })
  } else {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ Error: error.message })
  }
}

export default errorHandler
