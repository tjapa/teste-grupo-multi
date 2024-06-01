import { ExpressExchange } from '@/domain/models/express-exchange'

export interface DeleteExpressExchangeByIdRepository {
  deleteById: (
    expressExchange: string,
    customerId: string,
  ) => Promise<ExpressExchange | undefined>
}
