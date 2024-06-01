import { edenTreaty } from '@elysiajs/eden'
import { disconnect, drizzleClient } from '@/infra/db/drizzle/dizzleClient'
import {
  mockCustomer,
  mockCustomerAddress,
} from '@/tests/domain/mocks/mock-customer'
import {
  mockProductExpressExchangeAvailable,
  mockProductExpressExchangeUnavailable,
} from '@/tests/domain/mocks/mock-product'
import { mockInvoice } from '@/tests/domain/mocks/mock-invoice'
import {
  customerAddresses,
  customers,
  expressExchanges,
  invoiceProducts,
  invoices,
  products,
} from '@/infra/db/drizzle/schemas'
import { app } from '@/main/config/app'
import { env } from '@/main/config/env'
import { mockExpressExchange } from '@/tests/domain/mocks/mock-express-exchange'
import { faker } from '@faker-js/faker'
import { eq } from 'drizzle-orm'

app.listen(env.port, () => {
  console.log(`Server running at http://localhost:${env.port}`)
})

const apiClient = edenTreaty<typeof app>('http://localhost:3000')

describe('Receiver Routes', () => {
  afterAll(async () => {
    await disconnect()
    await app.stop()
  })

  describe('POST /express-exchanges', () => {
    // setup for success flow
    const customer = mockCustomer()
    const customerAddress = mockCustomerAddress()
    customerAddress.customerId = customer.id
    const product1 = mockProductExpressExchangeAvailable()
    const product2 = mockProductExpressExchangeUnavailable()
    const invoice = mockInvoice()
    invoice.customerId = customer.id

    beforeEach(async () => {
      await drizzleClient.delete(expressExchanges)
      await drizzleClient.delete(invoiceProducts)
      await drizzleClient.delete(invoices)
      await drizzleClient.delete(products)
      await drizzleClient.delete(customerAddresses)
      await drizzleClient.delete(customers)

      // setup for success flow
      await drizzleClient.insert(customers).values(customer)
      await drizzleClient.insert(customerAddresses).values(customerAddress)
      await drizzleClient.insert(products).values([product1, product2])
      await drizzleClient.insert(invoices).values(invoice)
      await drizzleClient.insert(invoiceProducts).values([
        { invoiceId: invoice.id, productId: product1.id },
        { invoiceId: invoice.id, productId: product2.id },
      ])
    })

    test('Should return 201 and an express exchange on success and if express exchange already exists for invoice should return 422', async () => {
      const response = await apiClient.api['express-exchanges'].post({
        customerId: customer.id,
        customerAddressId: customerAddress.id,
        invoiceId: invoice.id,
        productId: product1.id,
      })
      expect(response.status).toEqual(201)
      const expressExchangeCreated =
        await drizzleClient.query.expressExchanges.findFirst()
      const { createdAt, updatedAt, ...expressExchangeCreatedWithoutDates } =
        expressExchangeCreated!
      expect(response.data).toMatchObject(expressExchangeCreatedWithoutDates)

      const response2 = await apiClient.api['express-exchanges'].post({
        customerId: customer.id,
        customerAddressId: customerAddress.id,
        invoiceId: invoice.id,
        productId: product1.id,
      })
      expect(response2.status).toEqual(422)
    })

    test('Should return 422 on invalid request data', async () => {
      const invalidRequests = [
        {
          // missing field
          customerAddressId: customerAddress.id,
          invoiceId: invoice.id,
          productId: product1.id,
        },
        {
          // wrong type
          customerId: customer.id,
          customerAddressId: customerAddress.id,
          invoiceId: 312312,
          productId: product1.id,
        },
      ]

      for (const invalidRequest of invalidRequests) {
        const response =
          // @ts-ignore
          await apiClient.api['express-exchanges'].post(invalidRequest)
        expect(response.status).toEqual(422)
      }
    })
  })

  describe('DELETE /express-exchanges/:expressExchangeId', () => {
    // setup for success flow
    const customer = mockCustomer()
    const customerAddress = mockCustomerAddress()
    customerAddress.customerId = customer.id
    const product1 = mockProductExpressExchangeAvailable()
    const product2 = mockProductExpressExchangeUnavailable()
    const invoice = mockInvoice()
    invoice.customerId = customer.id
    let expressExchange = mockExpressExchange()
    expressExchange = {
      ...expressExchange,
      ...customerAddress,
      customerId: customer.id,
      invoiceId: invoice.id,
      productId: product1.id,
    }

    beforeEach(async () => {
      await drizzleClient.delete(expressExchanges)
      await drizzleClient.delete(invoiceProducts)
      await drizzleClient.delete(invoices)
      await drizzleClient.delete(products)
      await drizzleClient.delete(customerAddresses)
      await drizzleClient.delete(customers)

      // setup for success flow
      await drizzleClient.insert(customers).values(customer)
      await drizzleClient.insert(customerAddresses).values(customerAddress)
      await drizzleClient.insert(products).values([product1, product2])
      await drizzleClient.insert(invoices).values(invoice)
      await drizzleClient.insert(invoiceProducts).values([
        { invoiceId: invoice.id, productId: product1.id },
        { invoiceId: invoice.id, productId: product2.id },
      ])
      await drizzleClient.insert(expressExchanges).values(expressExchange)
    })

    test('Should return 200 and an express exchange on success', async () => {
      const response = await apiClient.api['express-exchanges'][
        expressExchange.id
      ].delete({
        customerId: customer.id,
      })

      const { createdAt, updatedAt, ...expressExchangeWithoutDates } =
        expressExchange

      expect(response.status).toEqual(200)
      expect(response.data).toMatchObject(expressExchangeWithoutDates)

      const expressExchangeShouldBeDeleted =
        await drizzleClient.query.expressExchanges.findFirst()
      expect(expressExchangeShouldBeDeleted).toBeUndefined()
    })

    test('Should return 422 if express exchange cant be deleted because status is different from "processing"', async () => {
      await drizzleClient
        .update(expressExchanges)
        .set({ status: 'sent' })
        .where(eq(expressExchanges.id, expressExchange.id))
      const response = await apiClient.api['express-exchanges'][
        expressExchange.id
      ].delete({
        customerId: customer.id,
      })
      expect(response.status).toEqual(422)
    })

    test('Should return 404 if express exchange not found', async () => {
      const response = await apiClient.api['express-exchanges'][
        faker.string.uuid()
      ].delete({
        customerId: customer.id,
      })
      expect(response.status).toEqual(404)
    })

    test('Should return 422 on invalid request data', async () => {
      const invalidRequests = [
        {
          // missing field
        },
        {
          // wrong type
          customerId: 12312321,
        },
      ]

      for (const invalidRequest of invalidRequests) {
        const response =
          // @ts-ignore
          await apiClient.api['express-exchanges'].post(invalidRequest)
        expect(response.status).toEqual(422)
      }
    })
  })
})
