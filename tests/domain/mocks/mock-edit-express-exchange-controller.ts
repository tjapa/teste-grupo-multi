import { faker } from '@faker-js/faker'
import {
  EditExpressExchangeParams,
  EditExpressExchangeUseCase,
} from '@/domain/use-cases/express-exchange/edit-express-exchange-use-case'
import { mockExpressExchange } from './mock-express-exchange'
import { ExpressExchange } from '@/domain/models/express-exchange'

export const mockEditExpressExchangeParams = (): EditExpressExchangeParams => ({
  customerId: faker.string.uuid(),
  expressExchangeId: faker.string.uuid(),
  productId: faker.string.uuid(),
  customerAddressId: faker.string.uuid(),
})

export class EditExpressExchangeStub implements EditExpressExchangeUseCase {
  async edit(
    editExpressExchangeParams: EditExpressExchangeParams,
  ): Promise<ExpressExchange> {
    return mockExpressExchange()
  }
}
