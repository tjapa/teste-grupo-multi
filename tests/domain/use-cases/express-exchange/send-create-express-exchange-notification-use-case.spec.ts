import { mockExpressExchange } from '../../mocks/mock-express-exchange'
import { ExpressExchange } from '@/domain/models/express-exchange'
import { GetExpressExchangeByIdRepositoryStub } from '@/tests/repository/mocks/mock-get-express-exchange-by-id-repository'
import { GetExpressExchangeByIdRepository } from '@/repository/express-exchange/get-express-exchange-by-id-repository'
import { mockCustomer } from '../../mocks/mock-customer'
import {
  SendCreateExpressExchangeNotification,
  SendExpressExchangeNotificationUseCase,
} from '@/domain/use-cases/express-exchange/send-create-express-exchange-notification-use-case'
import { GetCustomerByIdRepository } from '@/repository/customer/get-customer-by-id-repository'
import { GetCustomerByIdRepositoryStub } from '@/tests/repository/mocks/mock-get-customer-by-id-repository'
import { SendEmailNotificationIntegrationStub } from '@/tests/integration/mocks/mock-send-email-notification-integration'
import { Customer } from '@/domain/models/customer'
import { SendEmailNotificationIntegration } from '@/integration/notification/send-email-notification-integration'

type SutType = {
  sut: SendExpressExchangeNotificationUseCase
  customer: Customer
  expressExchange: ExpressExchange
  getCustomerByIdRepository: GetCustomerByIdRepository
  getExpressExchangeByIdRepository: GetExpressExchangeByIdRepository
  sendEmailNotificationIntegration: SendEmailNotificationIntegration
}

const makeSut = (): SutType => {
  const getExpressExchangeByIdRepository =
    new GetExpressExchangeByIdRepositoryStub()
  const getCustomerByIdRepository = new GetCustomerByIdRepositoryStub()
  const sendEmailNotificationIntegration =
    new SendEmailNotificationIntegrationStub()
  const sut = new SendCreateExpressExchangeNotification(
    getExpressExchangeByIdRepository,
    getCustomerByIdRepository,
    sendEmailNotificationIntegration,
  )

  // creation of sut with setup for success flow
  const customer = mockCustomer()
  let expressExchange = mockExpressExchange()
  expressExchange.customerId = customer.id
  jest
    .spyOn(getExpressExchangeByIdRepository, 'getById')
    .mockResolvedValue(expressExchange)
  jest
    .spyOn(getCustomerByIdRepository, 'getCustomerById')
    .mockResolvedValue(customer)

  return {
    sut,
    customer,
    expressExchange,
    getCustomerByIdRepository,
    getExpressExchangeByIdRepository,
    sendEmailNotificationIntegration,
  }
}

describe('Send Create Express Exchange Notification Use Case', () => {
  test('Should return true on success', async () => {
    const { sut, customer, expressExchange } = makeSut()

    const response = await sut.send(expressExchange.id, customer.id)
    expect(response).toBe(true)
  })

  test('Should return false if sendEmailNotificationIntegration returns false', async () => {
    const { sut, customer, expressExchange, sendEmailNotificationIntegration } =
      makeSut()

    jest
      .spyOn(sendEmailNotificationIntegration, 'send')
      .mockResolvedValueOnce(false)

    const response = await sut.send(expressExchange.id, customer.id)
    expect(response).toBe(false)
  })

  test('Should return false if sendEmailNotificationIntegration throws', async () => {
    const { sut, customer, expressExchange, sendEmailNotificationIntegration } =
      makeSut()

    jest
      .spyOn(sendEmailNotificationIntegration, 'send')
      .mockRejectedValueOnce(new Error())

    const response = await sut.send(expressExchange.id, customer.id)
    expect(response).toBe(false)
  })

  test('Should call getCustomerByIdRepository with correct params', async () => {
    const { sut, customer, expressExchange, getCustomerByIdRepository } =
      makeSut()

    const getByIdSpy = jest.spyOn(getCustomerByIdRepository, 'getCustomerById')

    await sut.send(expressExchange.id, customer.id)
    expect(getByIdSpy).toHaveBeenCalledWith(customer.id)
  })

  test('Should return false if getCustomerByIdRepository returns undefined', async () => {
    const { sut, customer, expressExchange, getCustomerByIdRepository } =
      makeSut()

    jest
      .spyOn(getCustomerByIdRepository, 'getCustomerById')
      .mockResolvedValueOnce(undefined)

    const response = await sut.send(expressExchange.id, customer.id)
    expect(response).toBe(false)
  })

  test('Should call getExpressExchangeByIdRepository with correct params', async () => {
    const { sut, customer, expressExchange, getExpressExchangeByIdRepository } =
      makeSut()

    const getByIdSpy = jest.spyOn(getExpressExchangeByIdRepository, 'getById')

    await sut.send(expressExchange.id, customer.id)
    expect(getByIdSpy).toHaveBeenCalledWith(expressExchange.id, customer.id)
  })

  test('Should return false if getExpressExchangeByIdRepository returns undefined', async () => {
    const { sut, customer, expressExchange, getExpressExchangeByIdRepository } =
      makeSut()

    jest
      .spyOn(getExpressExchangeByIdRepository, 'getById')
      .mockResolvedValueOnce(undefined)

    const response = await sut.send(expressExchange.id, customer.id)
    expect(response).toBe(false)
  })
})
