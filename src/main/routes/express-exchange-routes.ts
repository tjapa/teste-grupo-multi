import { Elysia, t } from 'elysia'
import { adaptElysiaHttpRequest } from '../adapters/elysia/elysia-http-request-adapter'
import { makeCreateExpressExchangeController } from '../factories/controllers/create-express-exchange-factory'
import { makeDeleteExpressExchangeController } from '../factories/controllers/delete-express-exchange-controller-factory'

const createExpressExchangeController = makeCreateExpressExchangeController()
const deleteExpressExchangeController = makeDeleteExpressExchangeController()

export const expressExchangeRoutes = new Elysia({
  prefix: '/customers/:customerId/express-exchanges',
})
  .post(
    '',
    async (context) => {
      const httpRequest = adaptElysiaHttpRequest(context)
      const httpResponse =
        await createExpressExchangeController.handle(httpRequest)
      context.set.status = httpResponse.statusCode
      return httpResponse.body
    },
    {
      body: t.Object({
        invoiceId: t.String(),
        productId: t.String(),
        customerAddressId: t.String(),
      }),
      params: t.Object({
        customerId: t.String(),
      }),
    },
  )
  .delete(
    '/:expressExchangeId',
    async (context) => {
      const httpRequest = adaptElysiaHttpRequest(context)
      const httpResponse =
        await deleteExpressExchangeController.handle(httpRequest)
      context.set.status = httpResponse.statusCode
      return httpResponse.body
    },
    {
      params: t.Object({
        customerId: t.String(),
        expressExchangeId: t.String(),
      }),
    },
  )
