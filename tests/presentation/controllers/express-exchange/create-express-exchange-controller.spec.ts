import { CreateExpressExchangeUseCase } from '@/domain/use-cases/express-exchange/create-express-exchange'
import {
  CreateExpressExchangeController,
  HttpRequestBody,
} from '@/presentation/controllers/express-exchange/create-express-exchange-controller'
import { CreateExpressExchangeStub } from '@/tests/domain/mocks/mock-create-express-exchange-use-case'
import { HttpRequest } from '@/presentation/protocols'
import { mockExpressExchange } from '@/tests/domain/mocks/mock-express-exchange'
import { faker } from '@faker-js/faker'
import { ExpressExchange } from '@/domain/models/express-exchange'
import { created } from '@/presentation/helpers/http-helpers'
import { ProductOutOfStockError } from '@/domain/errors/product-out-of-stock-error'
import { InvoiceWarrantyExpiredError } from '@/domain/errors/invoice-warranty-expired-error'
import { ExpressExchangeForInvoiceAlreadyExistsError } from '@/domain/errors/express-exchange-for-invoice-already-exists-error'
import { InvoiceDoesNotContainTheProductError } from '@/domain/errors/invoice-does-not-contain-the-product-error'
import { ExpressExchangeProductUnavailableError } from '@/domain/errors/express-exchange-product-unavailable'

type SutType = {
  sut: CreateExpressExchangeController
  createExpressExchangeUseCase: CreateExpressExchangeUseCase
  expressExchange: ExpressExchange
  httpRequest: HttpRequest<HttpRequestBody>
}

const makeSut = (): SutType => {
  const createExpressExchangeUseCase = new CreateExpressExchangeStub()
  const sut = new CreateExpressExchangeController(createExpressExchangeUseCase)

  // creation of sut with setup for success flow
  const expressExchange = mockExpressExchange()
  jest
    .spyOn(createExpressExchangeUseCase, 'create')
    .mockReturnValue(Promise.resolve(expressExchange))
  const httpRequest: HttpRequest<HttpRequestBody> = {
    body: {
      customerId: expressExchange.customerId,
      invoiceId: expressExchange.invoiceId,
      productId: expressExchange.productId,
      customerAddressId: faker.string.uuid(),
    },
    query: undefined,
    params: undefined,
  }

  return {
    sut,
    createExpressExchangeUseCase,
    expressExchange,
    httpRequest,
  }
}

describe('Create Express Exchange Controller', () => {
  test('Should return a new express exchange and status code 201', async () => {
    const { sut, expressExchange, httpRequest } = makeSut()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(created(expressExchange))
  })

  test('Should call createExpressExchangeUseCase with correct params', async () => {
    const { sut, createExpressExchangeUseCase, httpRequest } = makeSut()
    const createSpy = jest.spyOn(createExpressExchangeUseCase, 'create')
    await sut.handle(httpRequest)

    expect(createSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return unprocessable entity for some errors on createExpressExchangeUseCase', async () => {
    const { sut, createExpressExchangeUseCase, httpRequest } = makeSut()
    const errors = [
      ProductOutOfStockError,
      InvoiceWarrantyExpiredError,
      ExpressExchangeForInvoiceAlreadyExistsError,
      InvoiceDoesNotContainTheProductError,
      ExpressExchangeProductUnavailableError,
    ]

    for (const expectedError of errors) {
      jest
        .spyOn(createExpressExchangeUseCase, 'create')
        .mockRejectedValue(new expectedError('any', 'any'))
      const response = await sut.handle(httpRequest)
      expect(response.statusCode).toEqual(422)
    }
  })

  test('Should return server error for unexpected error on createExpressExchangeUseCase', async () => {
    const { sut, createExpressExchangeUseCase, httpRequest } = makeSut()

    jest
      .spyOn(createExpressExchangeUseCase, 'create')
      .mockRejectedValue(new Error())
    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toEqual(500)
  })
})
