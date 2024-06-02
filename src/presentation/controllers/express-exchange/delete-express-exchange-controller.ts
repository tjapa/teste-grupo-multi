import { DeleteExpressExchangeUseCase } from '@/domain/use-cases/express-exchange/delete-express-exchange-use-case'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ItemNotFoundError } from '@/domain/errors/item-not-found-error'
import {
  notFound,
  ok,
  serverError,
  unprocessableContent,
} from '@/presentation/helpers/http-helpers'
import { ExpressExchangeCantBeDeletedError } from '@/domain/errors/express-exchange-cant-be-deleted-error'

export type HttpRequestT = {
  params: {
    customerId: string
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
      const { params } = httpRequest
      const expressExchangeDeleted = await this.deleteExpressExchange.delete(
        params.expressExchangeId,
        params.customerId,
      )
      return ok(expressExchangeDeleted)
    } catch (error) {
      if (error instanceof ItemNotFoundError) {
        return notFound(error)
      } else if (error instanceof ExpressExchangeCantBeDeletedError) {
        return unprocessableContent(error)
      }
      console.error(error)
      return serverError()
    }
  }
}
