import { faker } from '@faker-js/faker'
import { Product } from '@/domain/models/product'

export const mockProductExpressExchangeAvailable = (): Product => ({
  id: faker.string.uuid(),
  name: faker.commerce.product(),
  sku: faker.string.alphanumeric(5),
  price: faker.commerce.price(),
  isExpressExchangeAvailable: true,
  createdAt: new Date(),
  updatedAt: new Date(),
})

export const mockProductExpressExchangeUnavailable = (): Product => ({
  id: faker.string.uuid(),
  name: faker.commerce.product(),
  sku: faker.string.alphanumeric(5),
  price: faker.commerce.price(),
  isExpressExchangeAvailable: false,
  createdAt: new Date(),
  updatedAt: new Date(),
})
