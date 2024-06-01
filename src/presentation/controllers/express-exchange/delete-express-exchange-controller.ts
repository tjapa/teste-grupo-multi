import { DeleteExpressExchangeUseCase } from '@/domain/use-cases/express-exchange/delete-express-exchange-use-case'
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

export class DeleteExpressExchangeController
  implements Controller<HttpRequestT> {
  constructor(
    private readonly deleteExpressExchange: DeleteExpressExchangeUseCase,
  ) { }

  async handle(httpRequest: HttpRequest<HttpRequestT>): Promise<HttpResponse> {
    try {
      const { body, params } = httpRequest
      const expressExchangeDeleted = await this.deleteExpressExchange.delete(
        params.expressExchangeId,
        body.customerId,
      )
      return ok(expressExchangeDeleted)
    } catch (error) {
      if (error instanceof ItemNotFoundError) {
        return notFound(error)
      }
      console.error(error)
      return serverError()
    }
  }
}
