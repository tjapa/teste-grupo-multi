import { HttpResponse } from '@/presentation/protocols/http'

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
})

export const created = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data,
})

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error.message,
})

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: 'Internal Server Error',
})

export const notFound = (error: Error): HttpResponse => ({
  statusCode: 404,
  body: error.message,
})

export const unprocessableContent = (error: Error): HttpResponse => ({
  statusCode: 422,
  body: error.message,
})
