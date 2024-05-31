import { disconnect, drizzleClient } from '@/infra/db/drizzle/dizzleClient'
import {
  customerAddresses,
  customers,
  expressExchanges,
  invoiceProducts,
  invoices,
  products,
} from '@/infra/db/drizzle/schemas'
import { InvoiceRepository } from '@/infra/db/drizzle/invoice-repository'
import { mockCustomer } from '@/tests/domain/mocks/mock-customer'
import {
  mockProductExpressExchangeAvailable,
  mockProductExpressExchangeUnavailable,
} from '@/tests/domain/mocks/mock-product'
import { mockInvoice } from '@/tests/domain/mocks/mock-invoice'
import { faker } from '@faker-js/faker'

describe('Invoice Repository', () => {
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

  const makeSut = (): InvoiceRepository => {
    return new InvoiceRepository()
  }

  describe('getByIdWithProductIds()', () => {
    test('Should return an invoice with product ids on success', async () => {
      const sut = makeSut()

      const customer = mockCustomer()
      const product1 = mockProductExpressExchangeAvailable()
      const product2 = mockProductExpressExchangeUnavailable()
      const invoice = mockInvoice()
      invoice.customerId = customer.id
      await drizzleClient.insert(customers).values(customer)
      await drizzleClient.insert(products).values([product1, product2])
      await drizzleClient.insert(invoices).values(invoice)
      await drizzleClient.insert(invoiceProducts).values([
        { invoiceId: invoice.id, productId: product1.id },
        { invoiceId: invoice.id, productId: product2.id },
      ])

      const invoiceReturned = await sut.getByIdWithProductIds(
        invoice.id,
        customer.id,
      )
      const {
        invoiceProducts: invoiceProductsReturned,
        ...onlyInvoiceReturned
      } = invoiceReturned!

      expect(onlyInvoiceReturned).toEqual(invoice)
      expect(invoiceProductsReturned).toHaveLength(2)
      expect(invoiceProductsReturned).toEqual(
        expect.arrayContaining([
          { productId: product1.id },
          { productId: product2.id },
        ]),
      )
    })

    test('Should return an undefined if invoice not found', async () => {
      const sut = makeSut()

      const invoiceReturned = await sut.getByIdWithProductIds(
        faker.string.uuid(),
        faker.string.uuid(),
      )

      expect(invoiceReturned).toBeUndefined()
    })

    test('Should return an undefined if is called with invalid uuid', async () => {
      const sut = makeSut()

      const invoiceReturned = await sut.getByIdWithProductIds(
        'any_invalid_id',
        faker.string.uuid(),
      )

      expect(invoiceReturned).toBeUndefined()
    })
  })
})
