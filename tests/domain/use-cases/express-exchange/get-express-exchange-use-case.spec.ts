import {
  GetExpressExchange,
  GetExpressExchangeUseCase,
} from '@/domain/use-cases/express-exchange/get-express-exchange-use-case'
import { mockExpressExchange } from '../../mocks/mock-express-exchange'
import { ItemNotFoundError } from '@/domain/errors/item-not-found-error'
import { ExpressExchange } from '@/domain/models/express-exchange'
import { GetExpressExchangeByIdRepositoryStub } from '@/tests/repository/mocks/mock-get-express-exchange-by-id-repository'
import { GetExpressExchangeByIdRepository } from '@/repository/express-exchange/get-express-exchange-by-id-repository'
import { mockCustomer } from '../../mocks/mock-customer'

type SutType = {
  sut: GetExpressExchangeUseCase
  expressExchange: ExpressExchange
  getExpressExchangeByIdRepository: GetExpressExchangeByIdRepository
}

const makeSut = (): SutType => {
  const getExpressExchangeByIdRepository =
    new GetExpressExchangeByIdRepositoryStub()
  const sut = new GetExpressExchange(getExpressExchangeByIdRepository)

  // creation of sut with setup for success flow
  const customer = mockCustomer()
  let expressExchange = mockExpressExchange()
  expressExchange.customerId = customer.id
  jest
    .spyOn(getExpressExchangeByIdRepository, 'getById')
    .mockResolvedValue(expressExchange)

  return {
    sut,
    expressExchange,
    getExpressExchangeByIdRepository,
  }
}

describe('Get Express Exchange Use Case', () => {
  test('Should return the get express exchange on success', async () => {
    const { sut, expressExchange } = makeSut()

    const expressExchangeReturned = await sut.get(
      expressExchange.id,
      expressExchange.customerId,
    )
    expect(expressExchangeReturned).toMatchObject(expressExchange)
  })

  test('Should call getExpressExchangeByIdRepository with correct params', async () => {
    const { sut, expressExchange, getExpressExchangeByIdRepository } = makeSut()

    const getByIdSpy = jest.spyOn(getExpressExchangeByIdRepository, 'getById')

    await sut.get(expressExchange.id, expressExchange.customerId)
    expect(getByIdSpy).toHaveBeenCalledWith(
      expressExchange.id,
      expressExchange.customerId,
    )
  })

  test('Should throw if getExpressExchangeByIdRepository returns undefined', async () => {
    const { sut, expressExchange, getExpressExchangeByIdRepository } = makeSut()

    jest
      .spyOn(getExpressExchangeByIdRepository, 'getById')
      .mockResolvedValueOnce(undefined)

    const promise = sut.get(expressExchange.id, expressExchange.customerId)
    expect(promise).rejects.toThrow(ItemNotFoundError)
  })
})
