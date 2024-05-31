export class ExpressExchangeForInvoiceAlreadyExistsError extends Error {
  constructor(invoiceId: string) {
    super(`Express Exchange for Invoice with id ${invoiceId} already exists`)
    this.name = 'ExpressExchangeForInvoiceAlreadyExists'
  }
}
