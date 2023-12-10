export interface OrderData {
  shipper_country: string
  shipper_city: string
  shipper_postcode: string
  shipper_pickup_on: string
  consignee_country: string
  consignee_city: string
  consignee_postcode: string
  consignee_delivery_on: string
  distance: number
  price: number
  placed_at: string
}
