import { GetExpressExchangeUseCase } from '@/domain/use-cases/express-exchange/get-express-exchange-use-case'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ItemNotFoundError } from '@/domain/errors/item-not-found-error'
import { notFound, ok, serverError } from '@/presentation/helpers/http-helpers'

export type HttpRequestT = {
  body: {
    customerId: string
  }
  params: {
    expressExchangeId: string
  }
}

export class GetExpressExchangeController implements Controller<HttpRequestT> {
  constructor(private readonly getExpressExchange: GetExpressExchangeUseCase) { }

  async handle(httpRequest: HttpRequest<HttpRequestT>): Promise<HttpResponse> {
    try {
      const { body, params } = httpRequest
      const expressExchangeGetd = await this.getExpressExchange.get(
        params.expressExchangeId,
        body.customerId,
      )
      return ok(expressExchangeGetd)
    } catch (error) {
      if (error instanceof ItemNotFoundError) {
        return notFound(error)
      }
      console.error(error)
      return serverError()
    }
  }
}
