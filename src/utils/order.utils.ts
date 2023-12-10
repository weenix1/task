import moment from 'moment'
import { OrderData } from '../interfaces'

export function validateOrderData(orderData: OrderData) {
  const {
    shipper_country,
    shipper_city,
    shipper_postcode,
    shipper_pickup_on,
    consignee_country,
    consignee_city,
    consignee_postcode,
    consignee_delivery_on,
    distance,
    price,
    placed_at,
  } = orderData

  if (
    !shipper_country ||
    !shipper_city ||
    !shipper_postcode ||
    !shipper_pickup_on ||
    !consignee_country ||
    !consignee_city ||
    !consignee_postcode ||
    !consignee_delivery_on ||
    !distance ||
    !price ||
    !placed_at
  ) {
    return false
  }

  const allowedCountries = [
    'DE',
    'DK',
    'PL',
    'CZ',
    'NL',
    'BE',
    'FR',
    'AT',
    'CH',
    'LU',
  ]
  const shipperValid = allowedCountries.includes(shipper_country)
  const consigneeValid = allowedCountries.includes(consignee_country)

  if (!shipperValid || !consigneeValid) return false

  return true
}

export const isOrderPlacedBefore1030 = (orderData: OrderData) => {
  const placedAt = moment(orderData.placed_at, 'YYYY-MM-DD HH:mm:ss')
  const tenThirty = moment('10:30', 'HH:mm')
  const isBefore = placedAt.isBefore(tenThirty)
  return isBefore
}

export function calculatePriceWithAC(
  distance: number,
  orderData: OrderData,
  existingOrders: OrderData[],
): number {
  let price = 0

  if (distance < 3 || distance > 300) {
    return -1
  }

  const isSameDayOrderExists = existingOrders.some(
    (order) => order.shipper_pickup_on === orderData.shipper_pickup_on,
  )

  if (isSameDayOrderExists) {
    price -= 1000
  }
  let pickupDate = moment()
  if (isOrderPlacedBefore1030(orderData)) {
    pickupDate = moment(orderData.shipper_pickup_on, 'YYYY-MM-DD')
  } else {
    pickupDate = moment(orderData.shipper_pickup_on, 'YYYY-MM-DD').add(
      1,
      'days',
    )
  }
  const deliveryDate = moment(orderData.consignee_delivery_on, 'YYYY-MM-DD')
  const daysDifference = moment.duration(deliveryDate.diff(pickupDate)).asDays()

  const isValidDeliveryWindow = daysDifference >= 2 && daysDifference <= 7

  if (!isValidDeliveryWindow) {
    return -2
  }

  if (distance <= 50) {
    price += 10000
  } else if (distance <= 150) {
    price += 20000
  } else {
    price += 30000
  }

  return price
}
