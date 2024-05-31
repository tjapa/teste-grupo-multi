import { ExpressExchange } from '@/domain/models/express-exchange'

export interface GetExpressExchangeByInvoiceIdRepository {
  getByInvoiceId: (
    invoiceId: string,
    customerId: string,
  ) => Promise<ExpressExchange | undefined>
}
