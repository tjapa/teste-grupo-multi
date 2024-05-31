import {
  CheckInvoiceWarrantyIntegration,
  InvoiceWarrantyCheck,
} from '@/integration/invoice/check-invoice-warranty-integration'

export const mockInvoiceWarrantyCheckTrue = (): InvoiceWarrantyCheck => ({
  warranty: true,
})

export const mockInvoiceWarrantyCheckFalse = (): InvoiceWarrantyCheck => ({
  warranty: false,
})

export class CheckInvoiceWarrantyIntegrationStub
  implements CheckInvoiceWarrantyIntegration
{
  async check(
    invoiceNumber: string,
    invoiceSerie: string,
  ): Promise<InvoiceWarrantyCheck> {
    return mockInvoiceWarrantyCheckTrue()
  }
}
