import { ExpressExchange } from '@/domain/models/express-exchange'
import { mockExpressExchange } from '@/tests/domain/mocks/mock-express-exchange'
import { GetExpressExchangeByInvoiceIdRepository } from '@/repository/express-exchange/get-express-exchange-by-invoice-id-repository'

export class GetExpressExchangeByInvoiceIdRepositoryStub
  implements GetExpressExchangeByInvoiceIdRepository
{
  async getByInvoiceId(
    invoiceId: string,
    customerId: string,
  ): Promise<ExpressExchange | undefined> {
    return mockExpressExchange()
  }
}

export class GetExpressExchangeByInvoiceIdRepositoryReturnUndefinedStub
  implements GetExpressExchangeByInvoiceIdRepository
{
  async getByInvoiceId(
    invoiceId: string,
    customerId: string,
  ): Promise<ExpressExchange | undefined> {
    return undefined
  }
}
