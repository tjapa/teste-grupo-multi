import { HttpRequest } from '@/presentation/protocols'

export function adaptElysiaHttpRequest<B = any, Q = any, P = any>(context: {
  body: B
  query: Q
  params: P
}) {
  const httpRequest: HttpRequest<{ body: B; query: Q; params: P }> = {
    body: context.body,
    query: context.query,
    params: context.params,
  }
  return httpRequest
}
