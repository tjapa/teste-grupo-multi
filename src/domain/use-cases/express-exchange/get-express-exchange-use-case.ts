import { ItemNotFoundError } from '@/domain/errors/item-not-found-error'
import { ExpressExchange } from '@/domain/models/express-exchange'
import { GetExpressExchangeByIdRepository } from '@/repository/express-exchange/get-express-exchange-by-id-repository'

export interface GetExpressExchangeUseCase {
  get(expressExchangeId: string, customerId: string): Promise<ExpressExchange>
}

export class GetExpressExchange implements GetExpressExchangeUseCase {
  constructor(
    private readonly getExpressExchangeByIdRepository: GetExpressExchangeByIdRepository,
  ) { }

  async get(
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

    return expressExchange
  }
}
