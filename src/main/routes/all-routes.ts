import Elysia from 'elysia'
import { expressExchangeRoutes } from './express-exchange-routes'

export const allRoutes = new Elysia({ prefix: 'api' }).use(
  expressExchangeRoutes,
)
