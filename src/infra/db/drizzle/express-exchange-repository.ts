import { ExpressExchange } from '@/domain/models/express-exchange'
import {
  CreateExpressExchangeData,
  CreateExpressExchangeRepository,
} from '@/repository/express-exchange/create-express-exchange-repository'
import { drizzleClient } from './dizzleClient'
import { expressExchanges } from './schemas'
import { GetExpressExchangeByInvoiceIdRepository } from '@/repository/express-exchange/get-express-exchange-by-invoice-id-repository'
import { and, eq } from 'drizzle-orm'
import { HandleInvalidUuidError } from './decorators/handle-invalid-uuid-error'

export class ExpressExchangeRepository
  implements
    CreateExpressExchangeRepository,
    GetExpressExchangeByInvoiceIdRepository
{
  @HandleInvalidUuidError
  async create(
    expressExchangeData: CreateExpressExchangeData,
  ): Promise<ExpressExchange> {
    return (
      await drizzleClient
        .insert(expressExchanges)
        .values(expressExchangeData)
        .returning()
    )[0]
  }

  @HandleInvalidUuidError
  async getByInvoiceId(
    invoiceId: string,
    customerId: string,
  ): Promise<ExpressExchange | undefined> {
    return await drizzleClient.query.expressExchanges.findFirst({
      where: and(
        eq(expressExchanges.invoiceId, invoiceId),
        eq(expressExchanges.customerId, customerId),
      ),
    })
  }
}