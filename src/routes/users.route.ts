import { NextFunction, Request, Response, Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import jwtAuthenticationMiddleware from '../middleware/jwt-authentication.middleware'
import userRepository from '../repositories/user.repository'

const userRoute = Router()

userRoute.get('/users', jwtAuthenticationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userRepository.findAllUsers()
    if (users.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'No users found 😐' })
    }
    return res.status(StatusCodes.OK).json({ users })
  } catch (error) {
    next(error)
  }
})

userRoute.get('/users/:uuid', jwtAuthenticationMiddleware, async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
  try {
    const { uuid } = req.params
    const user = await userRepository.findUserById(uuid)
    if (user === undefined) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'No user found 😐' })
    }
    return res.status(StatusCodes.OK).json({ user })
  } catch (error) {
    next(error)
  }
})

userRoute.post('/users', jwtAuthenticationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  const newUser = req.body

  try {
    const insert = await userRepository.create(newUser)
    return res.status(StatusCodes.CREATED).json({ insert })
  } catch (error) {
    next(error)
  }
})

userRoute.put('/users/:uuid', jwtAuthenticationMiddleware, async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
  const { uuid } = req.params
  const userUpdated = req.body
  userUpdated.uuid = uuid

  try {
    const update = await userRepository.update(userUpdated)

    if (update === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'No user found 😐' })
    }

    res.status(StatusCodes.OK).json({ message: 'Updated successfully! 😁' })
  } catch (error) {
    next(error)
  }
})

userRoute.delete('/users/:uuid', jwtAuthenticationMiddleware, async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
  const { uuid } = req.params

  try {
    const removed = await userRepository.remove(uuid)

    if (removed === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'No user found 😐' })
    }

    res.status(StatusCodes.OK).json({ message: `user with uuid ${uuid} was deleted successfully!` })
  } catch (error) {
    next(error)
  }
})

export default userRoute
