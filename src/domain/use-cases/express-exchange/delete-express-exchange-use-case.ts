import { ExpressExchangeCantBeDeletedError } from '@/domain/errors/express-exchange-cant-be-deleted-error'
import { ItemNotFoundError } from '@/domain/errors/item-not-found-error'
import { ExpressExchange } from '@/domain/models/express-exchange'
import { DeleteExpressExchangeByIdRepository } from '@/repository/express-exchange/delete-express-exchange-by-id-repository'
import { GetExpressExchangeByIdRepository } from '@/repository/express-exchange/get-express-exchange-by-id-repository'

export interface DeleteExpressExchangeUseCase {
  delete(
    expressExchangeId: string,
    customerId: string,
  ): Promise<ExpressExchange>
}

export class DeleteExpressExchange implements DeleteExpressExchangeUseCase {
  constructor(
    private readonly getExpressExchangeByIdRepository: GetExpressExchangeByIdRepository,
    private readonly deleteExpressExchangeByIdRepository: DeleteExpressExchangeByIdRepository,
  ) { }

  async delete(
    expressExchangeId: string,
    customerId: string,
  ): Promise<ExpressExchange> {
    const expressExchange = await this.getExpressExchangeByIdRepository.getById(
      expressExchangeId,
      customerId,
    )
    if (!expressExchange) {
      throw new ItemNotFoundError('Express Exchange', expressExchangeId)
    }
    if (expressExchange.status != 'processing') {
      throw new ExpressExchangeCantBeDeletedError(
        expressExchangeId,
        expressExchange.status,
      )
    }

    await this.deleteExpressExchangeByIdRepository.deleteById(
      expressExchangeId,
      customerId,
    )

    return expressExchange
  }
}
