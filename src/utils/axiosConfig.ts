import axios from 'axios'
import dotenv from 'dotenv'
import LogS from '../services/LogS'
dotenv.config()

const apiUrl = process.env.CARGO_API

const API = axios.create({
  baseURL: `${apiUrl}`,
})

const username = process.env.AUTH_USERNAME || 'defaultUsername'
const password = process.env.AUTH_PASSWORD || 'defaultPassword'

API.interceptors.request.use(
  async (config) => {
    config.auth = {
      username: username,
      password: password,
    }
    return config
  },
  (error) => {
    LogS.debug('Error on request', error)
    return Promise.reject(error)
  },
)

export default API
