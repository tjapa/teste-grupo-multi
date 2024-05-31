import { Elysia, t } from 'elysia'
import { makeCreateExpressExchangeController } from '../factories/controllers/create-express-exchange-factory'
import { adaptElysiaHttpRequest } from '../adapters/elysia/elysia-http-request-adapter'

const createExpressExchangeController = makeCreateExpressExchangeController()
export const expressExchangeRoutes = new Elysia({
  prefix: '/express-exchanges',
}).post(
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
