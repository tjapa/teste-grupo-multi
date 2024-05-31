import { disconnect, drizzleClient } from '@/infra/db/drizzle/dizzleClient'
import {
  customerAddresses,
  customers,
  expressExchanges,
  invoiceProducts,
  invoices,
  products,
} from '@/infra/db/drizzle/schemas'
import { CustomerRepository } from '@/infra/db/drizzle/customer-repository'
import {
  mockCustomer,
  mockCustomerAddress,
} from '@/tests/domain/mocks/mock-customer'
import { faker } from '@faker-js/faker'

describe('Customer Repository', () => {
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

  const makeSut = (): CustomerRepository => {
    return new CustomerRepository()
  }

  describe('getCustomerAddressById()', () => {
    test('Should return a customer address on success', async () => {
      const sut = makeSut()

      const customer = mockCustomer()
      const customerAddress = mockCustomerAddress()
      customerAddress.customerId = customer.id
      await drizzleClient.insert(customers).values(customer)
      await drizzleClient.insert(customerAddresses).values(customerAddress)

      const customerAddressReturned = await sut.getCustomerAddressById(
        customerAddress.id,
        customer.id,
      )
      expect(customerAddressReturned).toEqual(customerAddress)
    })

    test('Should return an undefined if customer address not found', async () => {
      const sut = makeSut()

      const customerReturned = await sut.getCustomerAddressById(
        faker.string.uuid(),
        faker.string.uuid(),
      )

      expect(customerReturned).toBeUndefined()
    })

    test('Should return an undefined if is called with invalid uuid', async () => {
      const sut = makeSut()

      const customerReturned = await sut.getCustomerAddressById(
        'any_invalid_id',
        'any_invalid_id',
      )

      expect(customerReturned).toBeUndefined()
    })
  })
})
