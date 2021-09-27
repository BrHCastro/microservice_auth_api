import db from '../database'
import User from '../models/user.model'

class UserRepository {
  async findAllUsers (): Promise<User[]> {
    const query = `
                SELECT uuid, username, email
                FROM ms_auth_user;
                `
    const { rows } = await db.query<User>(query)
    return rows || []
  }

  async findUserById (uuid: string) {
    const query = `
                SELECT uuid, username, email
                FROM ms_auth_user
                WHERE uuid = $1;
                `
    const values = [uuid]
    const { rows } = await db.query<User>(query, values)
    const [user] = rows
    return user
  }

  async create (user: User): Promise<string> {
    const script = `
                  INSERT INTO ms_auth_user (
                    username,
                    email,
                    password
                  )
                  VALUES ($1, $2, crypt($3, $4))
                  RETURNING uuid
                `
    const values = [user.username, user.email, user.password, process.env.PG_SECRET_KEY]
    const { rows } = await db.query<{uuid: string}>(script, values)
    const [newUser] = rows

    return newUser.uuid
  }

  async update (user: User): Promise<number> {
    const script = `
                    UPDATE ms_auth_user 
                    SET 
                      username = $1, 
                      email = $2,
                      password = crypt($3, $4)
                    WHERE uuid = $5;
                  `
    const values = [user.username, user.email, user.password, process.env.PG_SECRET_KEY, user.uuid]
    const result = await db.query(script, values)
    return result.rowCount
  }

  async remove (uuid: string): Promise<number> {
    const script = 'DELETE FROM ms_auth_user WHERE uuid = $1'
    const values = [uuid]
    const result = await db.query(script, values)
    return result.rowCount
  }
}

export default new UserRepository()
