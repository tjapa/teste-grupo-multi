import { disconnect, drizzleClient } from '@/infra/db/drizzle/dizzleClient'
import {
  customerAddresses,
  customers,
  expressExchanges,
  invoiceProducts,
  invoices,
  products,
} from '@/infra/db/drizzle/schemas'
import { ProductRepository } from '@/infra/db/drizzle/product-repository'
import { faker } from '@faker-js/faker'
import { mockProductExpressExchangeAvailable } from '@/tests/domain/mocks/mock-product'

describe('Product Repository', () => {
  afterAll(async () => {
    await disconnect()
  })

  beforeEach(async () => {
    await drizzleClient.delete(expressExchanges)
    await drizzleClient.delete(invoiceProducts)
    await drizzleClient.delete(invoices)
    await drizzleClient.delete(products)
    await drizzleClient.delete(customerAddresses)
    await drizzleClient.delete(customers)
  })

  const makeSut = (): ProductRepository => {
    return new ProductRepository()
  }

  describe('getById()', () => {
    test('Should return a product on success', async () => {
      const sut = makeSut()

      const product = mockProductExpressExchangeAvailable()
      await drizzleClient.insert(products).values(product)

      const productReturned = await sut.getById(product.id)

      expect(productReturned).toEqual(product)
    })

    test('Should return an undefined if product not found', async () => {
      const sut = makeSut()

      const productReturned = await sut.getById(faker.string.uuid())

      expect(productReturned).toBeUndefined()
    })

    test('Should return an undefined if is called with invalid uuid', async () => {
      const sut = makeSut()

      const productReturned = await sut.getById('any_invalid_id')

      expect(productReturned).toBeUndefined()
    })
  })
})
