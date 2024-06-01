import { DeleteExpressExchange } from '@/domain/use-cases/express-exchange/delete-express-exchange-use-case'
import { ExpressExchangeRepository } from '@/infra/db/drizzle/express-exchange-repository'
import { DeleteExpressExchangeController } from '@/presentation/controllers/express-exchange/delete-express-exchange-controller'

export const makeDeleteExpressExchangeController = () => {
  const expressExchangeRepository = new ExpressExchangeRepository()

  const deleteExpressExchange = new DeleteExpressExchange(
    expressExchangeRepository,
    expressExchangeRepository,
  )
  return new DeleteExpressExchangeController(deleteExpressExchange)
}
