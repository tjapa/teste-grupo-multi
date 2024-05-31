import { faker } from '@faker-js/faker'
import { Customer, CustomerAddress } from '@/domain/models/customer'

export const mockCustomer = (): Customer => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  cpf: '1234568900',
  phone: faker.phone.number(),
  createdAt: new Date(),
  updatedAt: new Date(),
})

export const mockCustomerAddress = (): CustomerAddress => ({
  id: faker.string.uuid(),
  customerId: faker.string.uuid(),
  streetAddress: faker.location.streetAddress(),
  streetAddressLine2: faker.location.secondaryAddress(),
  houseNumber: faker.string.numeric(3),
  district: faker.location.city(),
  city: faker.location.city(),
  state: faker.location.state(),
  createdAt: new Date(),
  updatedAt: new Date(),
})
