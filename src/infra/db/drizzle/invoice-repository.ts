import { InvoiceWithProductIds } from '@/domain/models/invoice'
import { drizzleClient } from './dizzleClient'
import { invoices } from './schemas'
import { and, eq } from 'drizzle-orm'
import { GetInvoiceByIdWithProductIdsRepository } from '@/repository/invoice/get-invoice-by-id-with-product-ids-repository'
import { HandleInvalidUuidError } from './decorators/handle-invalid-uuid-error'

export class InvoiceRepository
  implements GetInvoiceByIdWithProductIdsRepository
{
  @HandleInvalidUuidError
  async getByIdWithProductIds(
    invoiceId: string,
    customerId: string,
  ): Promise<InvoiceWithProductIds | undefined> {
    return await drizzleClient.query.invoices.findFirst({
      where: and(
        eq(invoices.id, invoiceId),
        eq(invoices.customerId, customerId),
      ),
      with: {
        invoiceProducts: {
          columns: {
            productId: true,
          },
        },
      },
    })
  }
}
