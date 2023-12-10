import basicAuth from 'express-basic-auth'
import dotenv from 'dotenv'
dotenv.config()

const users = {
  [process.env.AUTH_USERNAME || 'defaultUsername']:
    process.env.AUTH_PASSWORD || 'defaultPassword',
}

const basicAuthMiddleware = basicAuth({
  users,
  challenge: true,
})

export default basicAuthMiddleware
