export class InvoiceWarrantyExpiredError extends Error {
  constructor(invoiceId: string) {
    super(`Invoice with id ${invoiceId} warranty has expired`)
    this.name = 'InvoiceWarrantyExpired'
  }
}
