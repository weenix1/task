import { Request, Response } from 'express'
import { calculatePriceWithAC, validateOrderData } from '../utils'
import { OrderData } from '../interfaces'
import { client } from '../database'
import API from '../utils/axiosConfig'
import rateLimitMiddlewareS from '../middleware/rateLimitMiddlewareS'
import LogS from './LogS'

const apiUrl = process.env.CARGO_API

const routeCache: { [key: string]: Set<number> } = {}

LogS.debug('routeCache', routeCache)

const getOrders = async (req: Request, res: Response) => {
  try {
    const ordersQuery = await client.query('SELECT * FROM orders')
    return res.status(200).json(ordersQuery.rows)
  } catch (error) {
    LogS.error('Error fetching orders', error)
    return res.status(500).json({ error: 'Error fetching orders' })
  }
}

const createNewOrder = async (req: Request, res: Response) => {
  rateLimitMiddlewareS.rateLimit(req, res, async () => {
    const orderData = req.body as OrderData

    const isValidOrder = validateOrderData(orderData)

    if (!isValidOrder) {
      return res.status(400).json({ error: 'Invalid order data' })
    }

    try {
      const {
        shipper_country,
        shipper_postcode,
        shipper_pickup_on: shipperPickupOn,
        consignee_delivery_on: consigneeDeliveryOn,
        consignee_country,
        consignee_postcode,
      } = orderData

      const distanceResponse = await API.get(
        `${apiUrl}/${shipper_country}/${shipper_postcode}/${consignee_country}/${consignee_postcode}`,
      )

      const distanceFromCargoAPI = distanceResponse.data.distance
      const previousOrdersQuery = await client.query('SELECT * FROM orders')

      const calculatedPrice = calculatePriceWithAC(
        distanceFromCargoAPI,
        orderData,
        previousOrdersQuery.rows,
      )

      if (calculatedPrice === -1) {
        return res.status(400).json({ error: 'Invalid order distance' })
      }

      if (calculatedPrice === -2) {
        return res.status(400).json({ error: 'Invalid delivery window' })
      }

      try {
        const routeKey = `${orderData.distance}_${orderData.price}_${orderData.shipper_pickup_on}_${orderData.consignee_delivery_on}`

        if (!routeCache[routeKey]) {
          const ordersQuery = await client.query(
            'SELECT * FROM orders WHERE distance = $1 AND price = $2 AND shipper_pickup_on = $3 AND consignee_delivery_on = $4',
            [
              orderData.distance,
              orderData.price,
              orderData.shipper_pickup_on,
              orderData.consignee_delivery_on,
            ],
          )

          routeCache[routeKey] = new Set(
            ordersQuery.rows.map((order) => order.id),
          )
        }

        const newOrder = await client.query(
          'INSERT INTO orders (distance, price, shipper_pickup_on, consignee_delivery_on) VALUES ($1, $2, $3, $4) RETURNING id',
          [
            distanceFromCargoAPI,
            calculatedPrice,
            shipperPickupOn,
            consigneeDeliveryOn,
          ],
        )

        const newOrderId = newOrder.rows.length > 0 ? newOrder.rows[0].id : null
        if (!routeCache[routeKey]) {
          routeCache[routeKey] = new Set()
        }
        routeCache[routeKey].add(newOrderId)
      } catch (error) {
        LogS.error('Error saving order to database', error)
        return res.status(500).json({ error: 'Error saving order to database' })
      }

      return res
        .status(200)
        .json({ distance: distanceFromCargoAPI, price: calculatedPrice })
    } catch (error) {
      LogS.error('Error processing order', error)
      return res.status(500).json({ error: 'Error processing order' })
    }
  })
}

const handlerS = {
  getOrders,
  createNewOrder,
}

export default handlerS
