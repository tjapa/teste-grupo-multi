import { EditExpressExchangeUseCase } from '@/domain/use-cases/express-exchange/edit-express-exchange-use-case'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ExpressExchangeProductUnavailableError } from '@/domain/errors/express-exchange-product-unavailable'
import { InvoiceDoesNotContainTheProductError } from '@/domain/errors/invoice-does-not-contain-the-product-error'
import { InvoiceWarrantyExpiredError } from '@/domain/errors/invoice-warranty-expired-error'
import { ItemNotFoundError } from '@/domain/errors/item-not-found-error'
import { ProductOutOfStockError } from '@/domain/errors/product-out-of-stock-error'
import {
  ok,
  notFound,
  serverError,
  unprocessableContent,
} from '@/presentation/helpers/http-helpers'
import { MissingUpdateDataError } from '@/domain/errors/missing-updata-data-error'
import { ExpressExchangeCantBeEditedError } from '@/domain/errors/express-exchange-cant-be-edit-error'

export type HttpRequestT = {
  body: {
    productId: string
    customerAddressId: string
  }
  params: {
    expressExchangeId: string
    customerId: string
  }
}

export class EditExpressExchangeController implements Controller<HttpRequestT> {
  constructor(
    private readonly editExpressExchange: EditExpressExchangeUseCase,
  ) {}

  async handle(httpRequest: HttpRequest<HttpRequestT>): Promise<HttpResponse> {
    try {
      const { body, params } = httpRequest
      const expressExchangeEdited = await this.editExpressExchange.edit({
        expressExchangeId: params.expressExchangeId,
        productId: body.productId,
        customerAddressId: body.customerAddressId,
        customerId: params.customerId,
      })
      return ok(expressExchangeEdited)
    } catch (error) {
      if (error instanceof ItemNotFoundError) {
        return notFound(error)
      } else if (
        error instanceof MissingUpdateDataError ||
        error instanceof ExpressExchangeCantBeEditedError ||
        error instanceof ProductOutOfStockError ||
        error instanceof InvoiceWarrantyExpiredError ||
        error instanceof InvoiceDoesNotContainTheProductError ||
        error instanceof ExpressExchangeProductUnavailableError
      ) {
        return unprocessableContent(error)
      }
      console.error(error)
      return serverError()
    }
  }
}
