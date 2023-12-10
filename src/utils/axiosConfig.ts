import axios from 'axios'
import dotenv from 'dotenv'
import LogS from '../services/LogS'
import { envS } from '../services/EnvS'
dotenv.config()

const API = axios.create({
  baseURL: `${envS.getCaregoApi()}`,
})

API.interceptors.request.use(
  async (config) => {
    config.auth = {
      username: envS.getAuthUsername(),
      password: envS.getAuthPassword(),
    }
    return config
  },
  (error) => {
    LogS.debug('Error on request', error)
    return Promise.reject(error)
  },
)

export default API
