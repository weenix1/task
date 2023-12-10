import { Pool, PoolClient } from 'pg'
import dotenv from 'dotenv'
import LogS from '../services/LogS'
dotenv.config()

export let client: PoolClient
const { PGDATABASE, PGUSER, PGPASSWORD, PGHOST, PGPORT } = process.env

if (!PGPORT) {
  throw new Error('PGPORT environment variable is not set.')
}

const port = parseInt(PGPORT, 10)

if (isNaN(port)) {
  throw new Error('PGPORT is not a valid number.')
}

const createDatabase = async () => {
  try {
    const databaseName = 'bicycle_delivery'
    await client.query(`CREATE DATABASE ${databaseName}`)
    console.log(`Database '${databaseName}' created successfully.`)
  } catch (error) {
    console.error('Error creating database:', error)
  } finally {
    client.release()
  }
}

const connectToDatabase = async () => {
  const poolI = new Pool({
    user: PGUSER,
    host: PGHOST,
    database: PGDATABASE,
    password: PGPASSWORD,
    port: port,
  })

  try {
    client = await poolI.connect()

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        distance DECIMAL NOT NULL,
        price DECIMAL NOT NULL,
        shipper_pickup_on VARCHAR (30) NOT NULL,
        consignee_delivery_on VARCHAR (30) NOT NULL
      );
    `

    await client.query(createTableQuery)
  } catch (error) {
    LogS.error('Error connecting to database', error)
  }
}

export const DatabaseService = {
  createDatabase,
  connectToDatabase,
}
