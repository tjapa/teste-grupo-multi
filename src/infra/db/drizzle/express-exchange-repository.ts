import { ExpressExchange } from '@/domain/models/express-exchange'
import {
  CreateExpressExchangeData,
  CreateExpressExchangeRepository,
} from '@/repository/express-exchange/create-express-exchange-repository'
import { drizzleClient } from './dizzleClient'
import { expressExchanges } from './schemas'
import { GetExpressExchangeByInvoiceIdRepository } from '@/repository/express-exchange/get-express-exchange-by-invoice-id-repository'
import { and, eq, sql } from 'drizzle-orm'
import { HandleInvalidUuidError } from './decorators/handle-invalid-uuid-error'
import { GetExpressExchangeByIdRepository } from '@/repository/express-exchange/get-express-exchange-by-id-repository'
import { DeleteExpressExchangeByIdRepository } from '@/repository/express-exchange/delete-express-exchange-by-id-repository'
import {
  UpdateExpressExchangeData,
  UpdateExpressExchangeRepository,
} from '@/repository/express-exchange/update-express-exchange-repository'
import { conflictUpdateSetAllColumns } from './utils/conflict-update-set-all-columns'

export class ExpressExchangeRepository
  implements
    CreateExpressExchangeRepository,
    GetExpressExchangeByIdRepository,
    GetExpressExchangeByInvoiceIdRepository,
    UpdateExpressExchangeRepository,
    DeleteExpressExchangeByIdRepository
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
  async getById(
    expressExchangeId: string,
    customerId: string,
  ): Promise<ExpressExchange | undefined> {
    return await drizzleClient.query.expressExchanges.findFirst({
      where: and(
        eq(expressExchanges.id, expressExchangeId),
        eq(expressExchanges.customerId, customerId),
      ),
    })
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

  @HandleInvalidUuidError
  async update(
    expressExchangeData: UpdateExpressExchangeData,
    expressExchangeId: string,
    customerId: string,
  ): Promise<ExpressExchange> {
    return (
      await drizzleClient
        .update(expressExchanges)
        .set({
          ...expressExchangeData,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(
          and(
            eq(expressExchanges.id, expressExchangeId),
            eq(expressExchanges.customerId, customerId),
          ),
        )
        .returning()
    )[0]
  }

  @HandleInvalidUuidError
  async deleteById(
    expressExchangeId: string,
    customerId: string,
  ): Promise<ExpressExchange | undefined> {
    return (
      await drizzleClient
        .delete(expressExchanges)
        .where(
          and(
            eq(expressExchanges.id, expressExchangeId),
            eq(expressExchanges.customerId, customerId),
          ),
        )
        .returning()
    )[0]
  }
}
