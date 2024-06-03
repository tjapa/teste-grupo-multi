import { Elysia } from 'elysia'

export const basicLoggerMiddleware = new Elysia().onRequest((ctx) => {
  console.log(`${ctx.request.method} - ${ctx.request.url}`)
})
