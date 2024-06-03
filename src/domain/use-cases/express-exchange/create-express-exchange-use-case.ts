import { ExpressExchangeForInvoiceAlreadyExistsError } from '@/domain/errors/express-exchange-for-invoice-already-exists-error'
import { ExpressExchangeProductUnavailableError } from '@/domain/errors/express-exchange-product-unavailable'
import { InvoiceDoesNotContainTheProductError } from '@/domain/errors/invoice-does-not-contain-the-product-error'
import { InvoiceWarrantyExpiredError } from '@/domain/errors/invoice-warranty-expired-error'
import { ItemNotFoundError } from '@/domain/errors/item-not-found-error'
import { ProductOutOfStockError } from '@/domain/errors/product-out-of-stock-error'
import { ExpressExchange } from '@/domain/models/express-exchange'
import { CheckInvoiceWarrantyIntegration } from '@/integration/invoice/check-invoice-warranty-integration'
import { GetProductStockIntegration } from '@/integration/product/get-product-stock-integration'
import { GetCustomerAddressByIdRepository } from '@/repository/customer/get-customer-address-by-id-repository'
import {
  CreateExpressExchangeRepository,
  CreateExpressExchangeData,
} from '@/repository/express-exchange/create-express-exchange-repository'
import { GetExpressExchangeByInvoiceIdRepository } from '@/repository/express-exchange/get-express-exchange-by-invoice-id-repository'
import { GetInvoiceByIdWithProductIdsRepository } from '@/repository/invoice/get-invoice-by-id-with-product-ids-repository'
import { EnqueueCreateExpressExchangeNotificationRepository as EnqueueCreateExpressExchangeNotificationRepository } from '@/repository/notification/enqueue-create-express-exchange-notification'
import { GetProductByIdRepository } from '@/repository/product/get-product-by-id-repository'

export type CreateExpressExchangeParams = {
  customerId: string
  invoiceId: string
  productId: string
  customerAddressId: string
}

export interface CreateExpressExchangeUseCase {
  create(
    createExpressExchangeParams: CreateExpressExchangeParams,
  ): Promise<ExpressExchange>
}

export class CreateExpressExchange implements CreateExpressExchangeUseCase {
  constructor(
    private readonly getInvoiceByIdWithProductIdsRepository: GetInvoiceByIdWithProductIdsRepository,
    private readonly getProductByIdRepository: GetProductByIdRepository,
    private readonly getCustomerAddressByIdRepository: GetCustomerAddressByIdRepository,
    private readonly getProductStockIntegration: GetProductStockIntegration,
    private readonly getExpressExchangeByInvoiceIdRepository: GetExpressExchangeByInvoiceIdRepository,
    private readonly createExpressExchangeRepository: CreateExpressExchangeRepository,
    private readonly checkInvoiceWarranty: CheckInvoiceWarrantyIntegration,
    private readonly enqueueNotificationRepository: EnqueueCreateExpressExchangeNotificationRepository,
  ) { }

  async create(
    createExpressExchangeParams: CreateExpressExchangeParams,
  ): Promise<ExpressExchange> {
    const { customerId, invoiceId, productId, customerAddressId } =
      createExpressExchangeParams

    const invoiceWithProductIds =
      await this.getInvoiceByIdWithProductIdsRepository.getByIdWithProductIds(
        invoiceId,
        customerId,
      )
    if (!invoiceWithProductIds) {
      throw new ItemNotFoundError('Invoice', invoiceId)
    }

    const isProductInInvoice = invoiceWithProductIds.invoiceProducts.some(
      (invoiceProduct) => invoiceProduct.productId == productId,
    )
    if (!isProductInInvoice) {
      throw new InvoiceDoesNotContainTheProductError(invoiceId, productId)
    }

    const checkInvoiceWarranty = await this.checkInvoiceWarranty.check(
      invoiceWithProductIds.number,
      invoiceWithProductIds.serie,
    )
    if (!checkInvoiceWarranty.warranty) {
      throw new InvoiceWarrantyExpiredError(invoiceId)
    }

    const product = await this.getProductByIdRepository.getById(productId)
    if (!product) {
      throw new ItemNotFoundError('Product', productId)
    }
    if (!product.isExpressExchangeAvailable) {
      throw new ExpressExchangeProductUnavailableError(productId)
    }

    const productStock = await this.getProductStockIntegration.getProductStock(
      product.sku,
    )
    if (productStock.stock <= 0) {
      throw new ProductOutOfStockError(productId)
    }

    const expressExchangeForCurrentInvoice =
      await this.getExpressExchangeByInvoiceIdRepository.getByInvoiceId(
        invoiceId,
        customerId,
      )
    if (expressExchangeForCurrentInvoice) {
      throw new ExpressExchangeForInvoiceAlreadyExistsError(invoiceId)
    }

    const customerAddress =
      await this.getCustomerAddressByIdRepository.getCustomerAddressById(
        customerAddressId,
        customerId,
      )
    if (!customerAddress) {
      throw new ItemNotFoundError('Customer Address', customerAddressId)
    }

    const newExpressExchangeData: CreateExpressExchangeData = {
      customerId: customerId,
      invoiceId: invoiceId,
      productId: productId,
      status: 'processing',
      streetAddress: customerAddress.streetAddress,
      streetAddressLine2: customerAddress.streetAddressLine2,
      houseNumber: customerAddress.houseNumber,
      district: customerAddress.district,
      city: customerAddress.city,
      state: customerAddress.state,
    }
    const expressExchangeCreated =
      await this.createExpressExchangeRepository.create(newExpressExchangeData)

    try {
      await this.enqueueNotificationRepository.enqueueCreateExpressExchangeNotification(
        expressExchangeCreated.id,
        customerId,
      )
    } catch (error) {
      console.error(error)
    }

    return expressExchangeCreated
  }
}
