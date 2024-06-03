import '@bogeychan/elysia-polyfills/node/index.js'
import swagger from '@elysiajs/swagger'
import Elysia from 'elysia'
import { allRoutes } from '../routes/all-routes'
import { basicLoggerMiddleware } from '../middlewares/basic-logger'

export const app = new Elysia()
  .use(swagger())
  .use(basicLoggerMiddleware)
  .use(allRoutes)
