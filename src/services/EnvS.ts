import dotenv from 'dotenv'
import { parse } from 'path'
dotenv.config()

const {
  AUTH_USERNAME,
  AUTH_PASSWORD,
  CARGO_API,
  PGDATABASE,
  PGUSER,
  PGPORT,
  PGHOST,
  PGPASSWORD,
  PORT,
} = process.env

const getCaregoApi = () => {
  if (CARGO_API) {
    return CARGO_API
  }
  throw new Error('CARGO_API is not set')
}

const getAuthUsername = () => {
  if (AUTH_USERNAME) {
    return AUTH_USERNAME
  }
  throw new Error('AUTH_USERNAME is not set')
}

const getAuthPassword = () => {
  if (AUTH_PASSWORD) {
    return AUTH_PASSWORD
  }
  throw new Error('AUTH_PASSWORD is not set')
}

const getPort = () => {
  if (PORT) {
    return PORT
  }
  throw new Error('PORT is not set')
}

const getPgDatabase = () => {
  if (PGDATABASE) {
    return PGDATABASE
  }
  throw new Error('PGDATABASE is not set')
}

const getPgUser = () => {
  if (PGUSER) {
    return PGUSER ?? ''
  }
  throw new Error('PGUSER is not set')
}

const getPgPort = () => {
  if (PGPORT) {
    return parseInt(PGPORT, 10)
  }
  throw new Error('PGPORT is not set')
}

const getPgHost = () => {
  if (PGHOST) {
    return PGHOST
  }
  throw new Error('PGHOST is not set')
}

const getPgPassword = () => {
  if (PGPASSWORD) {
    return PGPASSWORD
  }
  throw new Error('PGPASSWORD is not set')
}

export const envS = {
  getCaregoApi,
  getAuthUsername,
  getAuthPassword,
  getPort,
  getPgDatabase,
  getPgUser,
  getPgPort,
  getPgHost,
  getPgPassword,
}
