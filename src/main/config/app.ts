import '@bogeychan/elysia-polyfills/node/index.js'
import swagger from '@elysiajs/swagger'
import Elysia from 'elysia'
import { allRoutes } from '../routes/all-routes'

export const app = new Elysia().use(swagger()).use(allRoutes)
