import axios from 'axios'
import dotenv from 'dotenv'
import LogS from '../services/LogS'
dotenv.config()

const apiUrl = process.env.CARGO_API

const API = axios.create({
  baseURL: `${apiUrl}`,
})

API.interceptors.request.use(
  async (config) => {
    config.auth = {
      username: 'cargoboard',
      password: 'so-and-board-10',
    }
    return config
  },
  (error) => {
    LogS.debug('Error on request', error)
    return Promise.reject(error)
  },
)

export default API
