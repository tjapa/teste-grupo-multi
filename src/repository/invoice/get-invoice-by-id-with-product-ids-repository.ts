import { InvoiceWithProductIds } from '@/domain/models/invoice'

export interface GetInvoiceByIdWithProductIdsRepository {
  getByIdWithProductIds: (
    invoiceId: string,
    customerId: string,
  ) => Promise<InvoiceWithProductIds | undefined>
}
