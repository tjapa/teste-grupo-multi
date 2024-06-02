import { GetExpressExchangeUseCase } from '@/domain/use-cases/express-exchange/get-express-exchange-use-case'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ItemNotFoundError } from '@/domain/errors/item-not-found-error'
import { notFound, ok, serverError } from '@/presentation/helpers/http-helpers'

export type HttpRequestT = {
  params: {
    customerId: string
    expressExchangeId: string
  }
}

export class GetExpressExchangeController implements Controller<HttpRequestT> {
  constructor(private readonly getExpressExchange: GetExpressExchangeUseCase) { }

  async handle(httpRequest: HttpRequest<HttpRequestT>): Promise<HttpResponse> {
    try {
      const { params } = httpRequest
      const expressExchangeGetd = await this.getExpressExchange.get(
        params.expressExchangeId,
        params.customerId,
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
