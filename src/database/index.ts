import { Pool, PoolClient } from 'pg'
import dotenv from 'dotenv'
import LogS from '../services/LogS'
import { envS } from '../services/EnvS'
dotenv.config()

export let client: PoolClient

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
    user: envS.getPgUser(),
    host: envS.getPgHost(),
    database: envS.getPgDatabase(),
    password: envS.getPgPassword(),
    port: envS.getPgPort(),
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
