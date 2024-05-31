import { CreateExpressExchange } from '@/domain/use-cases/express-exchange/create-express-exchange'
import { CustomerRepository } from '@/infra/db/drizzle/customer-repository'
import { ExpressExchangeRepository } from '@/infra/db/drizzle/express-exchange-repository'
import { InvoiceRepository } from '@/infra/db/drizzle/invoice-repository'
import { ProductRepository } from '@/infra/db/drizzle/product-repository'
import { InvoiceIntegration } from '@/infra/db/http-client/axios/invoice-integration'
import { ProductIntegration } from '@/infra/db/http-client/axios/product-integration'
import { CreateExpressExchangeController } from '@/presentation/controllers/express-exchange/create-express-exchange-controller'

export const makeCreateExpressExchangeController = () => {
  const invoiceRepository = new InvoiceRepository()
  const productRepository = new ProductRepository()
  const customerRepository = new CustomerRepository()
  const expressExchangeRepository = new ExpressExchangeRepository()
  const invoiceIntegration = new InvoiceIntegration()
  const productIntegration = new ProductIntegration()

  const createExpressExchange = new CreateExpressExchange(
    invoiceRepository,
    productRepository,
    customerRepository,
    productIntegration,
    expressExchangeRepository,
    expressExchangeRepository,
    invoiceIntegration,
  )
  return new CreateExpressExchangeController(createExpressExchange)
}
