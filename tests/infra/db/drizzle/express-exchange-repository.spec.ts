import { disconnect, drizzleClient } from '@/infra/db/drizzle/dizzleClient'
import {
  customerAddresses,
  customers,
  expressExchanges,
  invoiceProducts,
  invoices,
  products,
} from '@/infra/db/drizzle/schemas'
import { mockCustomer } from '@/tests/domain/mocks/mock-customer'
import {
  mockProductExpressExchangeAvailable,
  mockProductExpressExchangeUnavailable,
} from '@/tests/domain/mocks/mock-product'
import { mockInvoice } from '@/tests/domain/mocks/mock-invoice'
import { faker } from '@faker-js/faker'
import { ExpressExchangeRepository } from '@/infra/db/drizzle/express-exchange-repository'
import { mockExpressExchange } from '@/tests/domain/mocks/mock-express-exchange'

describe('Express Exchange Repository', () => {
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

  const makeSut = (): ExpressExchangeRepository => {
    return new ExpressExchangeRepository()
  }

  describe('getByInvoiceId()', () => {
    test('Should return an express exchange success', async () => {
      const sut = makeSut()

      const customer = mockCustomer()
      const product1 = mockProductExpressExchangeAvailable()
      const product2 = mockProductExpressExchangeUnavailable()
      const invoice = mockInvoice()
      invoice.customerId = customer.id
      const expressExchange = mockExpressExchange()
      expressExchange.customerId = customer.id
      expressExchange.invoiceId = invoice.id
      expressExchange.productId = product1.id
      await drizzleClient.insert(customers).values(customer)
      await drizzleClient.insert(products).values([product1, product2])
      await drizzleClient.insert(invoices).values(invoice)
      await drizzleClient.insert(invoiceProducts).values([
        { invoiceId: invoice.id, productId: product1.id },
        { invoiceId: invoice.id, productId: product2.id },
      ])
      await drizzleClient.insert(expressExchanges).values(expressExchange)

      const expressExchangeReturned = await sut.getByInvoiceId(
        invoice.id,
        customer.id,
      )

      expect(expressExchangeReturned).toEqual(expressExchange)
    })

    test('Should return an undefined if express exchange not found', async () => {
      const sut = makeSut()

      const expressExchangeReturned = await sut.getByInvoiceId(
        faker.string.uuid(),
        faker.string.uuid(),
      )

      expect(expressExchangeReturned).toBeUndefined()
    })

    test('Should return an undefined if is called with invalid uuid', async () => {
      const sut = makeSut()

      const expressExchangeReturned = await sut.getByInvoiceId(
        'any_invalid_id',
        faker.string.uuid(),
      )

      expect(expressExchangeReturned).toBeUndefined()
    })
  })

  describe('getById()', () => {
    test('Should return an express exchange on success', async () => {
      const sut = makeSut()

      const customer = mockCustomer()
      const product1 = mockProductExpressExchangeAvailable()
      const product2 = mockProductExpressExchangeUnavailable()
      const invoice = mockInvoice()
      invoice.customerId = customer.id
      const expressExchange = mockExpressExchange()
      expressExchange.customerId = customer.id
      expressExchange.invoiceId = invoice.id
      expressExchange.productId = product1.id
      await drizzleClient.insert(customers).values(customer)
      await drizzleClient.insert(products).values([product1, product2])
      await drizzleClient.insert(invoices).values(invoice)
      await drizzleClient.insert(invoiceProducts).values([
        { invoiceId: invoice.id, productId: product1.id },
        { invoiceId: invoice.id, productId: product2.id },
      ])
      await drizzleClient.insert(expressExchanges).values(expressExchange)

      const expressExchangeReturned = await sut.getById(
        expressExchange.id,
        customer.id,
      )

      expect(expressExchangeReturned).toEqual(expressExchange)
    })

    test('Should return an undefined if express exchange not found', async () => {
      const sut = makeSut()

      const expressExchangeReturned = await sut.getById(
        faker.string.uuid(),
        faker.string.uuid(),
      )

      expect(expressExchangeReturned).toBeUndefined()
    })

    test('Should return an undefined if is called with invalid uuid', async () => {
      const sut = makeSut()

      const expressExchangeReturned = await sut.getById(
        'any_invalid_id',
        faker.string.uuid(),
      )

      expect(expressExchangeReturned).toBeUndefined()
    })
  })

  describe('deleteById()', () => {
    test('Should return an express exchange on success', async () => {
      const sut = makeSut()

      const customer = mockCustomer()
      const product1 = mockProductExpressExchangeAvailable()
      const product2 = mockProductExpressExchangeUnavailable()
      const invoice = mockInvoice()
      invoice.customerId = customer.id
      const expressExchange = mockExpressExchange()
      expressExchange.customerId = customer.id
      expressExchange.invoiceId = invoice.id
      expressExchange.productId = product1.id
      await drizzleClient.insert(customers).values(customer)
      await drizzleClient.insert(products).values([product1, product2])
      await drizzleClient.insert(invoices).values(invoice)
      await drizzleClient.insert(invoiceProducts).values([
        { invoiceId: invoice.id, productId: product1.id },
        { invoiceId: invoice.id, productId: product2.id },
      ])
      await drizzleClient.insert(expressExchanges).values(expressExchange)

      const expressExchangeReturned = await sut.deleteById(
        expressExchange.id,
        customer.id,
      )

      expect(expressExchangeReturned).toEqual(expressExchange)
    })

    test('Should return an undefined if express exchange not found', async () => {
      const sut = makeSut()

      const expressExchangeReturned = await sut.deleteById(
        faker.string.uuid(),
        faker.string.uuid(),
      )

      expect(expressExchangeReturned).toBeUndefined()
    })

    test('Should return an undefined if is called with invalid uuid', async () => {
      const sut = makeSut()

      const expressExchangeReturned = await sut.deleteById(
        'any_invalid_id',
        faker.string.uuid(),
      )

      expect(expressExchangeReturned).toBeUndefined()
    })
  })
})
