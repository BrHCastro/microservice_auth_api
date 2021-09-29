import db from '../database'
import DataBaseError from '../models/errors/database.error.model'
import User from '../models/user.model'

class UserRepository {
  async findAllUsers (): Promise<User[]> {
    try {
      const query = `
                SELECT uuid, username, email
                FROM ms_auth_user;
                `
      const { rows } = await db.query<User>(query)
      return rows || []
    } catch (error) {
      throw new DataBaseError("Sorry, couldn't execute your request. 😐", error)
    }
  }

  async findUserById (uuid: string) {
    try {
      const query = `
                SELECT uuid, username, email
                FROM ms_auth_user
                WHERE uuid = $1;
                `
      const values = [uuid]
      const { rows } = await db.query<User>(query, values)
      const [user] = rows
      return user
    } catch (error) {
      throw new DataBaseError(`invalid input syntax for type uuid: ${uuid} 🤨`, error)
    }
  }

  async findUserByUsernameAndPassword (username: string, password: string): Promise<User | null> {
    try {
      const query = `
            SELECT uuid, username
            FROM ms_auth_user
            WHERE username = $1 
            AND password = crypt($2, $3);
            `
      const values = [username, password, process.env.PG_SECRET_KEY]
      const { rows } = await db.query<User>(query, values)
      const [user] = rows
      return user || null
    } catch (error) {
      throw new DataBaseError('Error in querying by username and password. 😐', error)
    }
  }

  async create (user: User): Promise<string> {
    if (user.password == null || user.email == null || user.username == null) {
      throw new DataBaseError('Username, E-mail and Password cannot be empty!')
    }

    try {
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
      const { rows } = await db.query<{ uuid: string }>(script, values)
      const [newUser] = rows

      return newUser.uuid
    } catch (error) {
      throw new DataBaseError(error.detail, error)
    }
  }

  async update (user: User): Promise<number> {
    if (user.password == null || user.email == null || user.username == null) {
      throw new DataBaseError('Username, E-mail and Password cannot be empty!')
    }

    try {
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
    } catch (error) {
      throw new DataBaseError(`invalid input syntax for type uuid: ${user.uuid} 🤨`, error)
    }
  }

  async remove (uuid: string): Promise<number> {
    try {
      const script = 'DELETE FROM ms_auth_user WHERE uuid = $1'
      const values = [uuid]
      const result = await db.query(script, values)
      return result.rowCount
    } catch (error) {
      throw new DataBaseError(`invalid input syntax for type uuid: ${uuid} 🤨`, error)
    }
  }
}

export default new UserRepository()
