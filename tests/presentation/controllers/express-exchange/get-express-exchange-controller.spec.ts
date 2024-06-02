import { GetExpressExchangeUseCase } from '@/domain/use-cases/express-exchange/get-express-exchange-use-case'
import {
  GetExpressExchangeController,
  HttpRequestT,
} from '@/presentation/controllers/express-exchange/get-express-exchange-controller'
import { HttpRequest } from '@/presentation/protocols'
import { mockExpressExchange } from '@/tests/domain/mocks/mock-express-exchange'
import { ExpressExchange } from '@/domain/models/express-exchange'
import { ok } from '@/presentation/helpers/http-helpers'
import { ItemNotFoundError } from '@/domain/errors/item-not-found-error'
import { GetExpressExchangeStub } from '@/tests/domain/mocks/mock-get-express-exchange-use-case'

type SutType = {
  sut: GetExpressExchangeController
  getExpressExchangeUseCase: GetExpressExchangeUseCase
  expressExchange: ExpressExchange
  httpRequest: HttpRequest<HttpRequestT>
}

const makeSut = (): SutType => {
  const getExpressExchangeUseCase = new GetExpressExchangeStub()
  const sut = new GetExpressExchangeController(getExpressExchangeUseCase)

  // creation of sut with setup for success flow
  const expressExchange = mockExpressExchange()
  jest
    .spyOn(getExpressExchangeUseCase, 'get')
    .mockResolvedValue(expressExchange)
  const httpRequest: HttpRequest<HttpRequestT> = {
    params: {
      expressExchangeId: expressExchange.id,

      customerId: expressExchange.customerId,
    },
  }

  return {
    sut,
    getExpressExchangeUseCase,
    expressExchange,
    httpRequest,
  }
}

describe('Get Express Exchange Controller', () => {
  test('Should return a new express exchange and status code 200', async () => {
    const { sut, expressExchange, httpRequest } = makeSut()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(ok(expressExchange))
  })

  test('Should call getExpressExchangeUseCase with correct params', async () => {
    const { sut, getExpressExchangeUseCase, httpRequest } = makeSut()
    const getSpy = jest.spyOn(getExpressExchangeUseCase, 'get')
    await sut.handle(httpRequest)

    expect(getSpy).toHaveBeenCalledWith(
      httpRequest.params.expressExchangeId,
      httpRequest.params.customerId,
    )
  })

  test('Should return not found if express exchange not found in getExpressExchangeUseCase', async () => {
    const { sut, getExpressExchangeUseCase, httpRequest } = makeSut()

    jest
      .spyOn(getExpressExchangeUseCase, 'get')
      .mockRejectedValue(new ItemNotFoundError('Express Exchange', 'any_id'))
    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toEqual(404)
  })

  test('Should return server error for unexpected error on getExpressExchangeUseCase', async () => {
    const { sut, getExpressExchangeUseCase, httpRequest } = makeSut()

    jest.spyOn(getExpressExchangeUseCase, 'get').mockRejectedValue(new Error())
    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toEqual(500)
  })
})
