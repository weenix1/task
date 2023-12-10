import basicAuth from 'express-basic-auth'
import dotenv from 'dotenv'
import { envS } from '../services/EnvS'
dotenv.config()

const users = {
  [envS.getAuthUsername() || 'defaultUsername']:
    envS.getAuthPassword() || 'defaultPassword',
}

const basicAuthMiddleware = basicAuth({
  users,
  challenge: true,
})

export default basicAuthMiddleware
