import { ExpressExchange } from '@/domain/models/express-exchange'
import {
  UpdateExpressExchangeData,
  UpdateExpressExchangeRepository,
} from '@/repository/express-exchange/update-express-exchange-repository'
import { mockExpressExchange } from '@/tests/domain/mocks/mock-express-exchange'

export class UpdateExpressExchangeRepositoryStub
  implements UpdateExpressExchangeRepository
{
  async update(
    expressExchangeData: UpdateExpressExchangeData,
    expressExchangeId: string,
    customerId: string,
  ): Promise<ExpressExchange> {
    return mockExpressExchange()
  }
}
