import { ExpressExchange } from '@/domain/models/express-exchange'
import {
  CreateExpressExchangeData,
  CreateExpressExchangeRepository,
} from '@/repository/express-exchange/create-express-exchange-repository'
import { mockExpressExchange } from '@/tests/domain/mocks/mock-express-exchange'

export class CreateExpressExchangeRepositoryStub
  implements CreateExpressExchangeRepository
{
  async create(
    expressExchangeData: CreateExpressExchangeData,
  ): Promise<ExpressExchange> {
    return mockExpressExchange()
  }
}
