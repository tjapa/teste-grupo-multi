import { HttpRequest, HttpResponse } from './http'

export interface Controller<B = unknown, Q = unknown, P = unknown> {
  handle: (httpRequest: HttpRequest<B, Q, P>) => Promise<HttpResponse>
}
