import { GetExpressExchangeUseCase } from '@/domain/use-cases/express-exchange/get-express-exchange-use-case'
import { mockExpressExchange } from './mock-express-exchange'
import { ExpressExchange } from '@/domain/models/express-exchange'

export class GetExpressExchangeStub implements GetExpressExchangeUseCase {
  async get(
    expressExchangeId: string,
    customerId: string,
  ): Promise<ExpressExchange> {
    return mockExpressExchange()
  }
}
