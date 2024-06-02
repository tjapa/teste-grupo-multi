import { DeleteExpressExchangeUseCase } from '@/domain/use-cases/express-exchange/delete-express-exchange-use-case'
import {
  DeleteExpressExchangeController,
  HttpRequestT,
} from '@/presentation/controllers/express-exchange/delete-express-exchange-controller'
import { DeleteExpressExchangeStub } from '@/tests/domain/mocks/mock-delete-express-exchange-use-case'
import { HttpRequest } from '@/presentation/protocols'
import { mockExpressExchange } from '@/tests/domain/mocks/mock-express-exchange'
import { ExpressExchange } from '@/domain/models/express-exchange'
import { ok } from '@/presentation/helpers/http-helpers'
import { ItemNotFoundError } from '@/domain/errors/item-not-found-error'
import { ExpressExchangeCantBeDeletedError } from '@/domain/errors/express-exchange-cant-be-deleted-error'

type SutType = {
  sut: DeleteExpressExchangeController
  deleteExpressExchangeUseCase: DeleteExpressExchangeUseCase
  expressExchange: ExpressExchange
  httpRequest: HttpRequest<HttpRequestT>
}

const makeSut = (): SutType => {
  const deleteExpressExchangeUseCase = new DeleteExpressExchangeStub()
  const sut = new DeleteExpressExchangeController(deleteExpressExchangeUseCase)

  // creation of sut with setup for success flow
  const expressExchange = mockExpressExchange()
  jest
    .spyOn(deleteExpressExchangeUseCase, 'delete')
    .mockResolvedValue(expressExchange)
  const httpRequest: HttpRequest<HttpRequestT> = {
    params: {
      expressExchangeId: expressExchange.id,
      customerId: expressExchange.customerId,
    },
  }

  return {
    sut,
    deleteExpressExchangeUseCase,
    expressExchange,
    httpRequest,
  }
}

describe('Delete Express Exchange Controller', () => {
  test('Should return a new express exchange and status code 200', async () => {
    const { sut, expressExchange, httpRequest } = makeSut()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(ok(expressExchange))
  })

  test('Should call deleteExpressExchangeUseCase with correct params', async () => {
    const { sut, deleteExpressExchangeUseCase, httpRequest } = makeSut()
    const deleteSpy = jest.spyOn(deleteExpressExchangeUseCase, 'delete')
    await sut.handle(httpRequest)

    expect(deleteSpy).toHaveBeenCalledWith(
      httpRequest.params.expressExchangeId,
      httpRequest.params.customerId,
    )
  })

  test('Should return not found if express exchange not found in deleteExpressExchangeUseCase', async () => {
    const { sut, deleteExpressExchangeUseCase, httpRequest } = makeSut()

    jest
      .spyOn(deleteExpressExchangeUseCase, 'delete')
      .mockRejectedValue(new ItemNotFoundError('Express Exchange', 'any_id'))
    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toEqual(404)
  })

  test('Should return unprocessable content if deleteExpressExchangeUseCase returns', async () => {
    const { sut, deleteExpressExchangeUseCase, httpRequest } = makeSut()

    jest
      .spyOn(deleteExpressExchangeUseCase, 'delete')
      .mockRejectedValue(
        new ExpressExchangeCantBeDeletedError('any_id', 'any_status'),
      )
    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toEqual(422)
  })

  test('Should return server error for unexpected error on deleteExpressExchangeUseCase', async () => {
    const { sut, deleteExpressExchangeUseCase, httpRequest } = makeSut()

    jest
      .spyOn(deleteExpressExchangeUseCase, 'delete')
      .mockRejectedValue(new Error())
    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toEqual(500)
  })
})
