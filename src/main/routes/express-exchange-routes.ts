import { Elysia, t } from 'elysia'
import { makeCreateExpressExchangeController } from '../factories/controllers/create-express-exchange-factory'
import { adaptElysiaHttpRequest } from '../adapters/elysia/elysia-http-request-adapter'
import { makeDeleteExpressExchangeController } from '../factories/controllers/delete-express-exchange-controller-factory'

const createExpressExchangeController = makeCreateExpressExchangeController()
const deleteExpressExchangeController = makeDeleteExpressExchangeController()

export const expressExchangeRoutes = new Elysia({
  prefix: '/express-exchanges',
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
        customerId: t.String(),
        invoiceId: t.String(),
        productId: t.String(),
        customerAddressId: t.String(),
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
      body: t.Object({
        customerId: t.String(),
      }),
      params: t.Object({
        expressExchangeId: t.String(),
      }),
    },
  )
