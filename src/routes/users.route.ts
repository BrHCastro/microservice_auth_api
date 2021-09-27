import { NextFunction, Request, Response, Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import userRepository from '../repositories/user.repository'

const userRoute = Router()

userRoute.get('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userRepository.findAllUsers()
    if (users.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'No users found 😐' })
    }
    return res.status(StatusCodes.OK).json({ users })
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({ Erro: err.message })
  }
})

userRoute.get('/users/:uuid', async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
  const { uuid } = req.params

  try {
    const user = await userRepository.findUserById(uuid)
    if (user === undefined) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'No users found 😐' })
    }
    return res.status(StatusCodes.OK).json({ user })
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({ Erro: err.message })
  }
})

userRoute.post('/users', async (req: Request, res: Response, next: NextFunction) => {
  const newUser = req.body

  try {
    const insert = await userRepository.create(newUser)

    if (insert === undefined) {
      throw new Error('There was an error entering new user 😥')
    }

    return res.status(StatusCodes.OK).json({ insert })
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({ Erro: err.message })
  }
})

userRoute.put('/users/:uuid', (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
  const { uuid } = req.params
  const userUpdated = req.body

  userUpdated.uuid = uuid

  res.status(StatusCodes.OK).json({ userUpdated })
})

userRoute.delete('/users/:uuid', (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
  const { uuid } = req.params

  res.status(StatusCodes.OK).send(`user with uuid ${uuid} was deleted successfully!`)
})

export default userRoute
