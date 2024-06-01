import { faker } from '@faker-js/faker'
import {
  CreateExpressExchangeParams,
  CreateExpressExchangeUseCase,
} from '@/domain/use-cases/express-exchange/create-express-exchange-use-case'
import { mockExpressExchange } from './mock-express-exchange'
import { ExpressExchange } from '@/domain/models/express-exchange'

export const mockCreateExpressExchangeParams =
  (): CreateExpressExchangeParams => ({
    customerId: faker.string.uuid(),
    invoiceId: faker.string.uuid(),
    productId: faker.string.uuid(),
    customerAddressId: faker.string.uuid(),
  })

export class CreateExpressExchangeStub implements CreateExpressExchangeUseCase {
  async create(
    createExpressExchangeParams: CreateExpressExchangeParams,
  ): Promise<ExpressExchange> {
    return mockExpressExchange()
  }
}
