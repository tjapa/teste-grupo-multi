export type ExpressExchange = {
  id: string
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
  createdAt: Date
  updatedAt: Date
}
