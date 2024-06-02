import { EditExpressExchange } from '@/domain/use-cases/express-exchange/edit-express-exchange-use-case'
import { CustomerRepository } from '@/infra/db/drizzle/customer-repository'
import { ExpressExchangeRepository } from '@/infra/db/drizzle/express-exchange-repository'
import { InvoiceRepository } from '@/infra/db/drizzle/invoice-repository'
import { ProductRepository } from '@/infra/db/drizzle/product-repository'
import { InvoiceIntegration } from '@/infra/db/http-client/axios/invoice-integration'
import { ProductIntegration } from '@/infra/db/http-client/axios/product-integration'
import { EditExpressExchangeController } from '@/presentation/controllers/express-exchange/edit-express-exchange-controller'

export const makeEditExpressExchangeController = () => {
  const invoiceRepository = new InvoiceRepository()
  const productRepository = new ProductRepository()
  const customerRepository = new CustomerRepository()
  const expressExchangeRepository = new ExpressExchangeRepository()
  const invoiceIntegration = new InvoiceIntegration()
  const productIntegration = new ProductIntegration()

  const editExpressExchange = new EditExpressExchange(
    invoiceRepository,
    productRepository,
    customerRepository,
    productIntegration,
    expressExchangeRepository,
    expressExchangeRepository,
    invoiceIntegration,
  )
  return new EditExpressExchangeController(editExpressExchange)
}
