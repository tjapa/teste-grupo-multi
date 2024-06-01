export type HttpResponse<B = unknown> = {
  statusCode: number
  body: B
}

export type HttpRequest<T = {}> = {} & T
