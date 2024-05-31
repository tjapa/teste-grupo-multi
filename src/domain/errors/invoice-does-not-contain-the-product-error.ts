export class InvoiceDoesNotContainTheProductError extends Error {
  constructor(invoiceId: string, productId: string) {
    super(
      `Invoice with id ${invoiceId} doesn't contain the product with id ${productId}`,
    )
    this.name = 'InvoiceDoesNotContainTheProduct'
  }
}
