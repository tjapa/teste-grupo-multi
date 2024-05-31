export type InvoiceWarrantyCheck = {
  warranty: boolean
}

export interface CheckInvoiceWarrantyIntegration {
  check: (
    invoiceNumber: string,
    invoiceSerie: string,
  ) => Promise<InvoiceWarrantyCheck>
}
