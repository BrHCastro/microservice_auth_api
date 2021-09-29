import { NextFunction, Request, Response } from 'express'
import ForbiddenError from '../models/errors/forbidden.error.model'
import userRepository from '../repositories/user.repository'

async function basicAuthenticationMiddleWare (req: Request, res: Response, next: NextFunction) {
  try {
    const authorizationHeader = req.headers.authorization

    if (!authorizationHeader) {
      throw new ForbiddenError('Credentials not informed.')
    }

    const [authenticationType, token] = authorizationHeader.split(' ')

    if (authenticationType !== 'Basic' || !token) {
      throw new ForbiddenError('Invalid authentication type.')
    }

    const tokemContent = Buffer.from(token, 'base64').toString('utf8')
    const [username, password] = tokemContent.split(':')

    if (!username || !password) {
      throw new ForbiddenError('Credentials not informed.')
    }

    const user = await userRepository.findUserByUsernameAndPassword(username, password)

    if (!user) {
      throw new ForbiddenError('Invalid username or password.')
    }

    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}

export default basicAuthenticationMiddleWare
