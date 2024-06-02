import { GetExpressExchange } from '@/domain/use-cases/express-exchange/get-express-exchange-use-case'
import { ExpressExchangeRepository } from '@/infra/db/drizzle/express-exchange-repository'
import { GetExpressExchangeController } from '@/presentation/controllers/express-exchange/get-express-exchange-controller'

export const makeGetExpressExchangeController = () => {
  const expressExchangeRepository = new ExpressExchangeRepository()

  const getExpressExchange = new GetExpressExchange(expressExchangeRepository)
  return new GetExpressExchangeController(getExpressExchange)
}
