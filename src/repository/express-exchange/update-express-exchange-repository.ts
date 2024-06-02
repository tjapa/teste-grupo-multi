import { ExpressExchange } from '@/domain/models/express-exchange'

export type UpdateExpressExchangeData = {
  productId?: string
  streetAddress?: string
  streetAddressLine2?: string | null
  houseNumber?: string
  district?: string
  city?: string
  state?: string
}
export interface UpdateExpressExchangeRepository {
  update: (
    expressExchangeData: UpdateExpressExchangeData,
  ) => Promise<ExpressExchange>
}
