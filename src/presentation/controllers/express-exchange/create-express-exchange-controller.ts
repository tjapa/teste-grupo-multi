import { CreateExpressExchangeUseCase } from '@/domain/use-cases/express-exchange/create-express-exchange-use-case'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ExpressExchangeForInvoiceAlreadyExistsError } from '@/domain/errors/express-exchange-for-invoice-already-exists-error'
import { ExpressExchangeProductUnavailableError } from '@/domain/errors/express-exchange-product-unavailable'
import { InvoiceDoesNotContainTheProductError } from '@/domain/errors/invoice-does-not-contain-the-product-error'
import { InvoiceWarrantyExpiredError } from '@/domain/errors/invoice-warranty-expired-error'
import { ItemNotFoundError } from '@/domain/errors/item-not-found-error'
import { ProductOutOfStockError } from '@/domain/errors/product-out-of-stock-error'
import {
  created,
  notFound,
  serverError,
  unprocessableContent,
} from '@/presentation/helpers/http-helpers'

export type HttpRequestT = {
  body: {
    invoiceId: string
    productId: string
    customerAddressId: string
  }
  params: {
    customerId: string
  }
}

export class CreateExpressExchangeController
  implements Controller<HttpRequestT> {
  constructor(
    private readonly createExpressExchange: CreateExpressExchangeUseCase,
  ) { }

  async handle(httpRequest: HttpRequest<HttpRequestT>): Promise<HttpResponse> {
    try {
      const { body, params } = httpRequest
      const expressExchangeCreated = await this.createExpressExchange.create({
        invoiceId: body.invoiceId,
        productId: body.productId,
        customerAddressId: body.customerAddressId,
        customerId: params.customerId,
      })
      return created(expressExchangeCreated)
    } catch (error) {
      if (error instanceof ItemNotFoundError) {
        return notFound(error)
      } else if (
        error instanceof ProductOutOfStockError ||
        error instanceof InvoiceWarrantyExpiredError ||
        error instanceof ExpressExchangeForInvoiceAlreadyExistsError ||
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
