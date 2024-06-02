import { EditExpressExchangeUseCase } from '@/domain/use-cases/express-exchange/edit-express-exchange-use-case'
import {
  EditExpressExchangeController,
  HttpRequestT,
} from '@/presentation/controllers/express-exchange/edit-express-exchange-controller'
import { HttpRequest } from '@/presentation/protocols'
import { mockExpressExchange } from '@/tests/domain/mocks/mock-express-exchange'
import { faker } from '@faker-js/faker'
import { ExpressExchange } from '@/domain/models/express-exchange'
import { ok } from '@/presentation/helpers/http-helpers'
import { ProductOutOfStockError } from '@/domain/errors/product-out-of-stock-error'
import { InvoiceWarrantyExpiredError } from '@/domain/errors/invoice-warranty-expired-error'
import { InvoiceDoesNotContainTheProductError } from '@/domain/errors/invoice-does-not-contain-the-product-error'
import { ExpressExchangeProductUnavailableError } from '@/domain/errors/express-exchange-product-unavailable'
import { ItemNotFoundError } from '@/domain/errors/item-not-found-error'
import { MissingUpdateDataError } from '@/domain/errors/missing-updata-data-error'
import { ExpressExchangeCantBeEditedError } from '@/domain/errors/express-exchange-cant-be-edit-error'
import { EditExpressExchangeStub } from '@/tests/domain/mocks/mock-edit-express-exchange-controller'

type SutType = {
  sut: EditExpressExchangeController
  editExpressExchangeUseCase: EditExpressExchangeUseCase
  expressExchange: ExpressExchange
  httpRequest: HttpRequest<HttpRequestT>
}

const makeSut = (): SutType => {
  const editExpressExchangeUseCase = new EditExpressExchangeStub()
  const sut = new EditExpressExchangeController(editExpressExchangeUseCase)

  // creation of sut with setup for success flow
  const expressExchange = mockExpressExchange()
  jest
    .spyOn(editExpressExchangeUseCase, 'edit')
    .mockResolvedValue(expressExchange)
  const httpRequest: HttpRequest<HttpRequestT> = {
    body: {
      productId: expressExchange.productId,
      customerAddressId: faker.string.uuid(),
    },
    params: {
      expressExchangeId: expressExchange.id,
      customerId: expressExchange.customerId,
    },
  }

  return {
    sut,
    editExpressExchangeUseCase,
    expressExchange,
    httpRequest,
  }
}

describe('Edit Express Exchange Controller', () => {
  test('Should return an edited express exchange and status code 200', async () => {
    const { sut, expressExchange, httpRequest } = makeSut()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(ok(expressExchange))
  })

  test('Should call editExpressExchangeUseCase with correct params', async () => {
    const { sut, editExpressExchangeUseCase, httpRequest } = makeSut()
    const editSpy = jest.spyOn(editExpressExchangeUseCase, 'edit')
    await sut.handle(httpRequest)

    expect(editSpy).toHaveBeenCalledWith({
      ...httpRequest.body,
      ...httpRequest.params,
    })
  })

  test('Should return unprocessable entity for some errors on editExpressExchangeUseCase', async () => {
    const { sut, editExpressExchangeUseCase, httpRequest } = makeSut()
    const errors = [
      MissingUpdateDataError,
      ExpressExchangeCantBeEditedError,
      ProductOutOfStockError,
      InvoiceWarrantyExpiredError,
      InvoiceDoesNotContainTheProductError,
      ExpressExchangeProductUnavailableError,
    ]

    for (const expectedError of errors) {
      jest
        .spyOn(editExpressExchangeUseCase, 'edit')
        .mockRejectedValue(new expectedError('any', 'any'))
      const response = await sut.handle(httpRequest)
      expect(response.statusCode).toEqual(422)
    }
  })

  test('Should return not found if editExpressExchangeUseCase returns a ItemNotFoundError', async () => {
    const { sut, editExpressExchangeUseCase, httpRequest } = makeSut()
    jest
      .spyOn(editExpressExchangeUseCase, 'edit')
      .mockRejectedValue(new ItemNotFoundError('any', 'any'))
    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toEqual(404)
  })

  test('Should return server error for unexpected error on editExpressExchangeUseCase', async () => {
    const { sut, editExpressExchangeUseCase, httpRequest } = makeSut()

    jest
      .spyOn(editExpressExchangeUseCase, 'edit')
      .mockRejectedValue(new Error())
    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toEqual(500)
  })
})
