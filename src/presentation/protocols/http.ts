export type HttpResponse<B = unknown> = {
  statusCode: number
  body: B
}

export type HttpRequest<B = unknown, Q = unknown, P = unknown> = {
  body: B
  query: Q
  params: P
}
