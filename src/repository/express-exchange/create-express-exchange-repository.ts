import { ExpressExchange } from '@/domain/models/express-exchange'

export type CreateExpressExchangeData = {
  customerId: string
  invoiceId: string
  productId: string
  status: 'processing' | 'sent' | 'done'
  streetAddress: string
  streetAddressLine2?: string | null
  houseNumber: string
  district: string
  city: string
  state: string
}

export interface CreateExpressExchangeRepository {
  create: (
    expressExchangeData: CreateExpressExchangeData,
  ) => Promise<ExpressExchange>
}
