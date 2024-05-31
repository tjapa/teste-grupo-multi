export type Invoice = {
  number: string
  id: string
  serie: string
  createdAt: Date
  updatedAt: Date
  customerId: string
  purchaseDate: Date
}

export type InvoiceWithProductIds = Invoice & {
  invoiceProducts: { productId: string }[]
}
