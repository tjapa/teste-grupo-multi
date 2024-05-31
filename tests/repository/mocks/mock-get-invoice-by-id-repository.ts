import { InvoiceWithProductIds } from '@/domain/models/invoice'
import { GetInvoiceByIdWithProductIdsRepository } from '@/repository/invoice/get-invoice-by-id-with-product-ids-repository'
import { mockInvoiceWithProductIds } from '@/tests/domain/mocks/mock-invoice'

export class GetInvoiceByIdWithProductIdsRepositoryStub
  implements GetInvoiceByIdWithProductIdsRepository
{
  async getByIdWithProductIds(
    invoiceId: string,
    customerId: string,
  ): Promise<InvoiceWithProductIds | undefined> {
    return mockInvoiceWithProductIds()
  }
}
