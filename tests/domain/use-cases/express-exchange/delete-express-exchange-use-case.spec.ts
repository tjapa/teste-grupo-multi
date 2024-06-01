import {
  DeleteExpressExchange,
  DeleteExpressExchangeUseCase,
} from '@/domain/use-cases/express-exchange/delete-express-exchange-use-case'
import { mockExpressExchange } from '../../mocks/mock-express-exchange'
import { ItemNotFoundError } from '@/domain/errors/item-not-found-error'
import { Customer } from '@/domain/models/customer'
import { ExpressExchange } from '@/domain/models/express-exchange'
import { GetExpressExchangeByIdRepositoryStub } from '@/tests/repository/mocks/mock-get-express-exchange-by-id-repository'
import { DeleteExpressExchangeByIdRepositoryStub } from '@/tests/repository/mocks/mock-delete-express-exchange-by-id-repository'
import { GetExpressExchangeByIdRepository } from '@/repository/express-exchange/get-express-exchange-by-id-repository'
import { DeleteExpressExchangeByIdRepository } from '@/repository/express-exchange/delete-express-exchange-by-id-repository'
import { mockCustomer } from '../../mocks/mock-customer'
import { ExpressExchangeCantBeDeletedError } from '@/domain/errors/express-exchange-cant-be-deleted-error'

type SutType = {
  sut: DeleteExpressExchangeUseCase
  expressExchange: ExpressExchange
  getExpressExchangeByIdRepository: GetExpressExchangeByIdRepository
  deleteExpressExchangeByIdRepository: DeleteExpressExchangeByIdRepository
}

const makeSut = (): SutType => {
  const getExpressExchangeByIdRepository =
    new GetExpressExchangeByIdRepositoryStub()
  const deleteExpressExchangeByIdRepository =
    new DeleteExpressExchangeByIdRepositoryStub()
  const sut = new DeleteExpressExchange(
    getExpressExchangeByIdRepository,
    deleteExpressExchangeByIdRepository,
  )

  // creation of sut with setup for success flow
  const customer = mockCustomer()
  let expressExchange = mockExpressExchange()
  expressExchange.customerId = customer.id
  jest
    .spyOn(getExpressExchangeByIdRepository, 'getById')
    .mockResolvedValue(expressExchange)
  jest
    .spyOn(deleteExpressExchangeByIdRepository, 'deleteById')
    .mockResolvedValue(expressExchange)

  return {
    sut,
    expressExchange,
    getExpressExchangeByIdRepository,
    deleteExpressExchangeByIdRepository,
  }
}

describe('Delete Express Exchange Use Case', () => {
  test('Should return the deleted express exchange on success', async () => {
    const { sut, expressExchange } = makeSut()

    const expressExchangeDeleted = await sut.delete(
      expressExchange.id,
      expressExchange.customerId,
    )
    expect(expressExchangeDeleted).toMatchObject(expressExchange)
  })

  test('Should call getExpressExchangeByIdRepository with correct params', async () => {
    const { sut, expressExchange, getExpressExchangeByIdRepository } = makeSut()

    const getByIdSpy = jest.spyOn(getExpressExchangeByIdRepository, 'getById')

    await sut.delete(expressExchange.id, expressExchange.customerId)
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

    const promise = sut.delete(expressExchange.id, expressExchange.customerId)
    expect(promise).rejects.toThrow(ItemNotFoundError)
  })

  test('Should throw if express exchange has status different than "processing"', async () => {
    const { sut, expressExchange, getExpressExchangeByIdRepository } = makeSut()

    expressExchange.status = 'sent'
    jest
      .spyOn(getExpressExchangeByIdRepository, 'getById')
      .mockResolvedValueOnce(expressExchange)

    const promise = sut.delete(expressExchange.id, expressExchange.customerId)
    expect(promise).rejects.toThrow(ExpressExchangeCantBeDeletedError)
  })

  test('Should call deleteExpressExchangeByIdRepository with correct params', async () => {
    const { sut, expressExchange, deleteExpressExchangeByIdRepository } =
      makeSut()

    const deleteByIdSpy = jest.spyOn(
      deleteExpressExchangeByIdRepository,
      'deleteById',
    )

    await sut.delete(expressExchange.id, expressExchange.customerId)
    expect(deleteByIdSpy).toHaveBeenCalledWith(
      expressExchange.id,
      expressExchange.customerId,
    )
  })
})
