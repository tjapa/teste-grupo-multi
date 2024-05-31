import { faker } from '@faker-js/faker'
import { ExpressExchange } from '@/domain/models/express-exchange'

export const mockExpressExchange = (): ExpressExchange => ({
  id: faker.string.uuid(),
  customerId: faker.string.uuid(),
  invoiceId: faker.string.uuid(),
  productId: faker.string.uuid(),
  status: 'processing',
  streetAddress: faker.location.streetAddress(),
  streetAddressLine2: faker.location.secondaryAddress(),
  houseNumber: faker.string.numeric(3),
  district: faker.location.city(),
  city: faker.location.city(),
  state: faker.location.state(),
  createdAt: new Date(),
  updatedAt: new Date(),
})
