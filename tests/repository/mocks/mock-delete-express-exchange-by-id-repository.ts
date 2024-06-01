import { ExpressExchange } from '@/domain/models/express-exchange'
import { DeleteExpressExchangeByIdRepository } from '@/repository/express-exchange/delete-express-exchange-by-id-repository'
import { mockExpressExchange } from '@/tests/domain/mocks/mock-express-exchange'

export class DeleteExpressExchangeByIdRepositoryStub
  implements DeleteExpressExchangeByIdRepository
{
  async deleteById(
    expressExchangeId: string,
    customerId: string,
  ): Promise<ExpressExchange> {
    return mockExpressExchange()
  }
}
