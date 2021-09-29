import User from '../models/user.model'

declare module 'express-serve-static-core' {

    // eslint-disable-next-line no-unused-vars
    interface Request {
        user?: User
    }
}
