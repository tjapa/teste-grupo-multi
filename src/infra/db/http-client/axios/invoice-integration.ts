import { sacExpressExchangesClient } from './sac-express-exchanges-api-axios-client'
import {
  CheckInvoiceWarrantyIntegration,
  InvoiceWarrantyCheck,
} from '@/integration/invoice/check-invoice-warranty-integration'

export class InvoiceIntegration implements CheckInvoiceWarrantyIntegration {
  async check(
    invoiceNumber: string,
    invoiceSerie: string,
  ): Promise<InvoiceWarrantyCheck> {
    const params = new URLSearchParams({
      number: invoiceNumber,
      serie: invoiceSerie,
    })
    const response = await sacExpressExchangesClient.get('invoices/warranty', {
      params,
    })
    return response.data
  }
}
