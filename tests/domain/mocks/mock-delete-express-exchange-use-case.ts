import { DeleteExpressExchangeUseCase } from '@/domain/use-cases/express-exchange/delete-express-exchange-use-case'
import { mockExpressExchange } from './mock-express-exchange'
import { ExpressExchange } from '@/domain/models/express-exchange'

export class DeleteExpressExchangeStub implements DeleteExpressExchangeUseCase {
  async delete(
    expressExchangeId: string,
    customerId: string,
  ): Promise<ExpressExchange> {
    return mockExpressExchange()
  }
}
