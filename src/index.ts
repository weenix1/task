import express, { Request, Response } from 'express'
import listEndpoints from 'express-list-endpoints'
import cors from 'cors'
import { DatabaseService } from './database'
import {
  notFoundHandler,
  unauthorizedHandler,
  badRequestHandler,
  genericErrorHandler,
} from './errorHanlers'
import ordersRouter from './services'
import basicAuthMiddleware from './middleware/basicAuthMiddleware'

const app = express()
app.use(express.json())
app.use(cors())

app.use(basicAuthMiddleware)

app.use('/orders', ordersRouter)

// ********************************* ERROR HANDLERS ************************************

app.use(notFoundHandler)
app.use(unauthorizedHandler)
app.use(badRequestHandler)
app.use(genericErrorHandler)

DatabaseService.connectToDatabase().then(() => {
  const port = process.env.PORT || 8080
  app.listen(port, async () => {
    console.table(listEndpoints(app))
    console.log(`Server is running on port ${port}`)
    await DatabaseService.connectToDatabase()
  })
})

export { app }
