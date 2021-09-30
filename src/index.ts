import express from 'express'
import bearerAuthenticationMiddleware from './middleware/bearer-authentication.middleware'
import errorHandler from './middleware/error-handler.middleware'
import authorizationRoute from './routes/authorization.route'
import statusRoute from './routes/status.route'
import userRoute from './routes/users.route'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(statusRoute)
app.use(bearerAuthenticationMiddleware, userRoute)
app.use(authorizationRoute)

// Middleware
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT} 🔥🔥🔥`)
})
