import { NextFunction, Request, Response, Router } from 'express'
import JWT from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import basicAuthenticationMiddleWare from '../middleware/basic-authentication.middleware'
import ForbiddenError from '../models/errors/forbidden.error.model'

const authorizationRoute = Router()

authorizationRoute.post('/token', basicAuthenticationMiddleWare, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user

    if (!user) {
      throw new ForbiddenError('User not informed.')
    }

    const jwtPayload = { username: user.username }
    const jwtOptions = { subject: user?.uuid }
    const jwtSecretKey = process.env.JWT_SECRET_KEY

    const jwt = JWT.sign(jwtPayload, jwtSecretKey, jwtOptions)

    res.status(StatusCodes.OK).json({ token: jwt })
  } catch (error) {
    next(error)
  }
})

export default authorizationRoute