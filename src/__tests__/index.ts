import supertest from 'supertest'
import dotenv from 'dotenv'
import { app } from '..'
import { Pool } from 'pg'
import { client } from '../database'
import basicAuthMiddleware from '../middleware/basicAuthMiddleware'

dotenv.config()

const request = supertest(app)

describe('Testing the testing environment', () => {
  it('should check that true is true', () => {
    expect(true).toBe(true)
  })
})

describe('Testing the app endpoints', () => {
  beforeAll(() => {
    app.use(basicAuthMiddleware)
  })
  it('should establish a successful pg db connection', async () => {
    const { PGUSER, PGHOST, PGDATABASE, PGPASSWORD, PGPORT } = process.env
    const pool = new Pool({
      user: PGUSER,
      password: PGPASSWORD,
      host: PGHOST,
      port: (PGPORT as unknown) as number,
      database: PGDATABASE,
    })
    const client = await pool.connect()

    expect(client).toBeTruthy()

    client.release()
  })

  it('should check that the GET /orders endpoint returns a list of orders', async () => {
    const username = process.env.AUTH_USERNAME || 'defaultUsername'
    const password = process.env.AUTH_PASSWORD || 'defaultPassword'
    const response = await request.get('/orders').auth(username, password)
    expect(response.status).toBe(200)
    expect(response.body.length).toBeGreaterThan(0)
  })

  it(' should create a new order POST /orders endpoint', async () => {
    const username = process.env.AUTH_USERNAME || 'defaultUsername'
    const password = process.env.AUTH_PASSWORD || 'defaultPassword'
    const response = await request
      .post('/orders')
      .auth(username, password)
      .send({
        shipper_country: 'DE',
        shipper_city: 'BL',
        shipper_postcode: '10115',
        shipper_pickup_on: '2023-12-12',
        consignee_country: 'DE',
        consignee_city: 'Hamburg',
        consignee_postcode: '20253',
        consignee_delivery_on: '2023-12-15',
        distance: '388',
        price: '23',
        placed_at: '23.12.2023',
      })
    expect(response.status).toBe(200)
    expect(response.body).toBeTruthy()
  })

  afterAll(async () => {
    client.release()
  })
})
