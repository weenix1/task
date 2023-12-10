import express from 'express'
import handlerS from './handlerS'

const ordersRouter = express.Router()

ordersRouter.route('/').get(handlerS.getOrders).post(handlerS.createNewOrder)

export default ordersRouter
