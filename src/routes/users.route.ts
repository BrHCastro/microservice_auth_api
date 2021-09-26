import { NextFunction, Request, Response, Router } from 'express'
import { StatusCodes } from 'http-status-codes'

const userRoute = Router()

userRoute.get('/users', (req: Request, res: Response, next: NextFunction) => {
  const users = [{ name: 'Henrique', email: 'hendecastro@gmail.com' }]
  res.status(StatusCodes.OK).json({ users })
})

userRoute.get('/users/:uuid', (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
  const { uuid } = req.params
  res.status(StatusCodes.OK).json({ uuid })
})

userRoute.post('/users', (req: Request, res: Response, next: NextFunction) => {
  const newUser = req.body
  res.status(StatusCodes.CREATED).json({ newUser })
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
