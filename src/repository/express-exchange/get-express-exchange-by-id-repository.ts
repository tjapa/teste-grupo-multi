import { ExpressExchange } from '@/domain/models/express-exchange'

export interface GetExpressExchangeByIdRepository {
  getById: (
    expressExchange: string,
    customerId: string,
  ) => Promise<ExpressExchange | undefined>
}
