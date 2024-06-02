import { ExpressExchangeCantBeEditedError } from '@/domain/errors/express-exchange-cant-be-edit-error'
import { ExpressExchangeProductUnavailableError } from '@/domain/errors/express-exchange-product-unavailable'
import { InvoiceDoesNotContainTheProductError } from '@/domain/errors/invoice-does-not-contain-the-product-error'
import { InvoiceWarrantyExpiredError } from '@/domain/errors/invoice-warranty-expired-error'
import { ItemNotFoundError } from '@/domain/errors/item-not-found-error'
import { MissingUpdateDataError } from '@/domain/errors/missing-updata-data-error'
import { ProductOutOfStockError } from '@/domain/errors/product-out-of-stock-error'
import { ExpressExchange } from '@/domain/models/express-exchange'
import { CheckInvoiceWarrantyIntegration } from '@/integration/invoice/check-invoice-warranty-integration'
import { GetProductStockIntegration } from '@/integration/product/get-product-stock-integration'
import { GetCustomerAddressByIdRepository } from '@/repository/customer/get-customer-address-by-id-repository'
import { GetExpressExchangeByIdRepository } from '@/repository/express-exchange/get-express-exchange-by-id-repository'
import {
  UpdateExpressExchangeData,
  UpdateExpressExchangeRepository,
} from '@/repository/express-exchange/update-express-exchange-repository'
import { GetInvoiceByIdWithProductIdsRepository } from '@/repository/invoice/get-invoice-by-id-with-product-ids-repository'
import { GetProductByIdRepository } from '@/repository/product/get-product-by-id-repository'

export type EditExpressExchangeParams = {
  customerId: string
  expressExchangeId: string
  productId?: string
  customerAddressId?: string
}

export interface EditExpressExchangeUseCase {
  edit(
    editExpressExchangeParams: EditExpressExchangeParams,
  ): Promise<ExpressExchange>
}

export class EditExpressExchange implements EditExpressExchangeUseCase {
  constructor(
    private readonly getInvoiceByIdWithProductIdsRepository: GetInvoiceByIdWithProductIdsRepository,
    private readonly getProductByIdRepository: GetProductByIdRepository,
    private readonly getCustomerAddressByIdRepository: GetCustomerAddressByIdRepository,
    private readonly getProductStockIntegration: GetProductStockIntegration,
    private readonly getExpressExchangeByIdRepository: GetExpressExchangeByIdRepository,
    private readonly updateExpressExchangeRepository: UpdateExpressExchangeRepository,
    private readonly checkInvoiceWarranty: CheckInvoiceWarrantyIntegration,
  ) {}

  async edit(
    editExpressExchangeParams: EditExpressExchangeParams,
  ): Promise<ExpressExchange> {
    const { customerId, expressExchangeId, productId, customerAddressId } =
      editExpressExchangeParams

    if (!productId && !customerAddressId) {
      throw new MissingUpdateDataError()
    }

    const expressExchange = await this.getExpressExchangeByIdRepository.getById(
      expressExchangeId,
      customerId,
    )
    if (!expressExchange) {
      throw new ItemNotFoundError('Express Exchange', expressExchangeId)
    }
    if (expressExchange.status != 'processing') {
      throw new ExpressExchangeCantBeEditedError(
        expressExchangeId,
        expressExchange.status,
      )
    }

    const invoiceId = expressExchange.invoiceId
    const invoiceWithProductIds =
      await this.getInvoiceByIdWithProductIdsRepository.getByIdWithProductIds(
        invoiceId,
        customerId,
      )
    if (!invoiceWithProductIds) {
      throw new ItemNotFoundError('Invoice', invoiceId)
    }

    const checkInvoiceWarranty = await this.checkInvoiceWarranty.check(
      invoiceWithProductIds.number,
      invoiceWithProductIds.serie,
    )
    if (!checkInvoiceWarranty.warranty) {
      throw new InvoiceWarrantyExpiredError(expressExchangeId)
    }

    let expressExchangeEditData: UpdateExpressExchangeData = {}

    if (productId) {
      const isProductInInvoice = invoiceWithProductIds.invoiceProducts.some(
        (invoiceProduct) => invoiceProduct.productId == productId,
      )
      if (!isProductInInvoice) {
        throw new InvoiceDoesNotContainTheProductError(invoiceId, productId)
      }

      const product = await this.getProductByIdRepository.getById(productId)
      if (!product) {
        throw new ItemNotFoundError('Product', productId)
      }
      if (!product.isExpressExchangeAvailable) {
        throw new ExpressExchangeProductUnavailableError(productId)
      }

      const productStock =
        await this.getProductStockIntegration.getProductStock(product.sku)
      if (productStock.stock <= 0) {
        throw new ProductOutOfStockError(productId)
      }

      expressExchangeEditData.productId = productId
    }

    if (customerAddressId) {
      const customerAddress =
        await this.getCustomerAddressByIdRepository.getCustomerAddressById(
          customerAddressId,
          customerId,
        )
      if (!customerAddress) {
        throw new ItemNotFoundError('Customer Address', customerAddressId)
      }

      expressExchangeEditData.streetAddress = customerAddress.streetAddress
      expressExchangeEditData.streetAddressLine2 =
        customerAddress.streetAddressLine2
      expressExchangeEditData.houseNumber = customerAddress.houseNumber
      expressExchangeEditData.district = customerAddress.district
      expressExchangeEditData.city = customerAddress.city
      expressExchangeEditData.state = customerAddress.state
    }

    const expressExchangeEdited =
      await this.updateExpressExchangeRepository.update(
        expressExchangeEditData,
        expressExchangeId,
        customerId,
      )

    return expressExchangeEdited
  }
}
