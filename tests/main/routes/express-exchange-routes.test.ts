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
import { redisClient } from '@/infra/db/ioredis/connection'
import { notifExpressExchangeQueue } from '@/infra/bullmq/notification-queue'

app.listen(env.port, () => {
  console.log(`Server running at http://localhost:${env.port}`)
})

const apiClient = edenTreaty<typeof app>('http://localhost:3000')

describe('Express Exchange Routes', () => {
  afterAll(async () => {
    await redisClient.quit()
    await disconnect()
    await app.stop()
  })

  describe('POST /customers/:customerId/express-exchanges', () => {
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
      await notifExpressExchangeQueue.drain()
    })

    test('Should return 201 and an express exchange on success and if express exchange already exists for invoice should return 422 and add create exchange notification to queue ', async () => {
      const response = await apiClient.api.customers[customer.id][
        'express-exchanges'
      ].post({
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

      const response2 = await apiClient.api.customers[customer.id][
        'express-exchanges'
      ].post({
        customerAddressId: customerAddress.id,
        invoiceId: invoice.id,
        productId: product1.id,
      })
      expect(response2.status).toEqual(422)

      const counts = await notifExpressExchangeQueue.getJobCounts('wait')
      expect(counts.wait).toBe(1)
    })

    test('Should return 422 on invalid request data', async () => {
      const invalidRequests = [
        {
          // missing field
          invoiceId: invoice.id,
          productId: product1.id,
        },
        {
          // wrong type
          customerAddressId: customerAddress.id,
          invoiceId: 312312,
          productId: product1.id,
        },
      ]

      for (const invalidRequest of invalidRequests) {
        const response = await apiClient.api.customers[customer.id][
          'express-exchanges'
        ].post(
          // @ts-ignore
          invalidRequest,
        )
        expect(response.status).toEqual(422)
      }
    })
  })

  describe('GET /customers/:customerId/express-exchanges/:expressExchangeId', () => {
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
      const response =
        await apiClient.api.customers[customer.id]['express-exchanges'][
          expressExchange.id
        ].get()

      const { createdAt, updatedAt, ...expressExchangeWithoutDates } =
        expressExchange

      expect(response.status).toEqual(200)
      expect(response.data).toMatchObject(expressExchangeWithoutDates)
    })

    test('Should return 404 if express exchange not found', async () => {
      const response =
        await apiClient.api.customers[customer.id]['express-exchanges'][
          faker.string.uuid()
        ].get()
      expect(response.status).toEqual(404)
    })
  })

  describe('DELETE /customers/:customerId/express-exchanges/:expressExchangeId', () => {
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
      const response =
        await apiClient.api.customers[customer.id]['express-exchanges'][
          expressExchange.id
        ].delete()

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
      const response =
        await apiClient.api.customers[customer.id]['express-exchanges'][
          expressExchange.id
        ].delete()
      expect(response.status).toEqual(422)
    })

    test('Should return 404 if express exchange not found', async () => {
      const response =
        await apiClient.api.customers[customer.id]['express-exchanges'][
          faker.string.uuid()
        ].delete()
      expect(response.status).toEqual(404)
    })
  })

  describe('PATCH /customers/:customerId/express-exchanges/:expressExchangeId', () => {
    // setup for success flow
    const customer = mockCustomer()
    const currentCustomerAddress = mockCustomerAddress()
    currentCustomerAddress.customerId = customer.id
    const updatedCustomerAddress = mockCustomerAddress()
    updatedCustomerAddress.customerId = customer.id
    const currentProduct = mockProductExpressExchangeAvailable()
    const updatedProduct = mockProductExpressExchangeAvailable()
    const invoice = mockInvoice()
    invoice.customerId = customer.id
    let expressExchange = mockExpressExchange()
    expressExchange = {
      ...expressExchange,
      ...currentCustomerAddress,
      customerId: customer.id,
      invoiceId: invoice.id,
      productId: currentProduct.id,
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
      await drizzleClient
        .insert(customerAddresses)
        .values([currentCustomerAddress, updatedCustomerAddress])
      await drizzleClient
        .insert(products)
        .values([currentProduct, updatedProduct])
      await drizzleClient.insert(invoices).values(invoice)
      await drizzleClient.insert(invoiceProducts).values([
        { invoiceId: invoice.id, productId: currentProduct.id },
        { invoiceId: invoice.id, productId: updatedProduct.id },
      ])
      await drizzleClient.insert(expressExchanges).values(expressExchange)
    })

    test('Should return 200 and an express exchange on success', async () => {
      const response = await apiClient.api.customers[customer.id][
        'express-exchanges'
      ][expressExchange.id].patch({
        productId: updatedProduct.id,
        customerAddressId: updatedCustomerAddress.id,
      })

      const expressExchangeUpdateData = {
        productId: updatedProduct.id,
        streetAddress: updatedCustomerAddress.streetAddress,
        streetAddressLine2: updatedCustomerAddress.streetAddressLine2,
        houseNumber: updatedCustomerAddress.houseNumber,
        district: updatedCustomerAddress.district,
        city: updatedCustomerAddress.city,
        state: updatedCustomerAddress.state,
      }

      expect(response.status).toEqual(200)
      expect(response.data).toMatchObject(expressExchangeUpdateData)

      const expressExchangeShouldBeUpdated =
        await drizzleClient.query.expressExchanges.findFirst()
      expect(expressExchangeShouldBeUpdated).toMatchObject(
        expressExchangeUpdateData,
      )
    })

    test('Should return 422 if express exchange cant be edited because status is different from "processing"', async () => {
      await drizzleClient
        .update(expressExchanges)
        .set({ status: 'sent' })
        .where(eq(expressExchanges.id, expressExchange.id))
      const response = await apiClient.api.customers[customer.id][
        'express-exchanges'
      ][expressExchange.id].patch({
        productId: updatedProduct.id,
        customerAddressId: updatedCustomerAddress.id,
      })
      expect(response.status).toEqual(422)
    })

    test('Should return 404 if express exchange not found', async () => {
      const response = await apiClient.api.customers[customer.id][
        'express-exchanges'
      ][faker.string.uuid()].patch({
        productId: updatedProduct.id,
        customerAddressId: updatedCustomerAddress.id,
      })
      expect(response.status).toEqual(404)
    })
  })
})
