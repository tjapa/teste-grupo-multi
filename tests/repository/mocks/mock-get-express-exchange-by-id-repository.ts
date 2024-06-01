import { ExpressExchange } from '@/domain/models/express-exchange'
import { GetExpressExchangeByIdRepository } from '@/repository/express-exchange/get-express-exchange-by-id-repository'
import { mockExpressExchange } from '@/tests/domain/mocks/mock-express-exchange'

export class GetExpressExchangeByIdRepositoryStub
  implements GetExpressExchangeByIdRepository
{
  async getById(
    expressExchangeId: string,
    customerId: string,
  ): Promise<ExpressExchange | undefined> {
    return mockExpressExchange()
  }
}
