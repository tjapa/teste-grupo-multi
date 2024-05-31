import { faker } from '@faker-js/faker'
import { Invoice, InvoiceWithProductIds } from '../models/invoice'

export const mockInvoice = (): Invoice => ({
  id: faker.string.uuid(),
  customerId: faker.string.uuid(),
  number: faker.string.numeric(5),
  serie: faker.string.numeric(5),
  purchaseDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
})

export const mockInvoiceWithProductIds = (): InvoiceWithProductIds => ({
  id: faker.string.uuid(),
  customerId: faker.string.uuid(),
  number: faker.string.numeric(5),
  serie: faker.string.numeric(5),
  purchaseDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  invoiceProducts: [
    {
      productId: faker.string.uuid(),
    },
    {
      productId: faker.string.uuid(),
    },
    {
      productId: faker.string.uuid(),
    },
  ],
})
