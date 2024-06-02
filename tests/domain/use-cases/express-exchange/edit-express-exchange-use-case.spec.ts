import {
  mockCustomer,
  mockCustomerAddress,
} from '@/tests/domain/mocks/mock-customer'
import {
  EditExpressExchange,
  EditExpressExchangeParams,
  EditExpressExchangeUseCase,
} from '@/domain/use-cases/express-exchange/edit-express-exchange-use-case'
import { GetInvoiceByIdWithProductIdsRepositoryStub } from '@/tests/repository/mocks/mock-get-invoice-by-id-repository'
import { GetProductByIdRepositoryStub } from '@/tests/repository/mocks/mock-get-product-by-id-repository'
import { GetCustomerAddressByIdRepositoryStub } from '@/tests/repository/mocks/mock-get-customer-address-by-id-repository'
import { GetProductStockIntegrationStub } from '@/tests/integration/mocks/mock-get-product-stock-integration'
import { GetInvoiceByIdWithProductIdsRepository } from '@/repository/invoice/get-invoice-by-id-with-product-ids-repository'
import { GetProductByIdRepository } from '@/repository/product/get-product-by-id-repository'
import { GetCustomerAddressByIdRepository } from '@/repository/customer/get-customer-address-by-id-repository'
import { GetProductStockIntegration } from '@/integration/product/get-product-stock-integration'
import {
  UpdateExpressExchangeData,
  UpdateExpressExchangeRepository,
} from '@/repository/express-exchange/update-express-exchange-repository'
import { CheckInvoiceWarrantyIntegration } from '@/integration/invoice/check-invoice-warranty-integration'
import { UpdateExpressExchangeRepositoryStub } from '@/tests/repository/mocks/mock-update-express-exchange-repository'
import {
  CheckInvoiceWarrantyIntegrationStub,
  mockInvoiceWarrantyCheckFalse,
} from '@/tests/integration/mocks/mock-check-invoice-warranty-integration'
import {
  mockProductExpressExchangeAvailable,
  mockProductExpressExchangeUnavailable,
} from '../../mocks/mock-product'
import {
  mockInvoice,
  mockInvoiceWithProductIds,
} from '../../mocks/mock-invoice'
import { mockExpressExchange } from '../../mocks/mock-express-exchange'
import { ItemNotFoundError } from '@/domain/errors/item-not-found-error'
import { CustomerAddress } from '@/domain/models/customer'
import { InvoiceDoesNotContainTheProductError } from '@/domain/errors/invoice-does-not-contain-the-product-error'
import { InvoiceWarrantyExpiredError } from '@/domain/errors/invoice-warranty-expired-error'
import { InvoiceWithProductIds } from '@/domain/models/invoice'
import { Product } from '@/domain/models/product'
import { ProductOutOfStockError } from '@/domain/errors/product-out-of-stock-error'
import { GetExpressExchangeByIdRepositoryStub } from '@/tests/repository/mocks/mock-get-express-exchange-by-id-repository'
import { GetExpressExchangeByIdRepository } from '@/repository/express-exchange/get-express-exchange-by-id-repository'
import { ExpressExchange } from '@/domain/models/express-exchange'
import { ExpressExchangeProductUnavailableError } from '@/domain/errors/express-exchange-product-unavailable'
import { MissingUpdateDataError } from '@/domain/errors/missing-updata-data-error'
import { ExpressExchangeCantBeEditedError } from '@/domain/errors/express-exchange-cant-be-edit-error'

type SutType = {
  sut: EditExpressExchangeUseCase
  currentExpressExchange: ExpressExchange
  updatedCustomerAddress: CustomerAddress
  updatedProduct: Product
  updatedExpressExchange: ExpressExchange
  invoiceWithProductIds: InvoiceWithProductIds
  editExpressExchangeParams: EditExpressExchangeParams
  getInvoiceByIdWithProductIdsRepository: GetInvoiceByIdWithProductIdsRepository
  getProductByIdRepository: GetProductByIdRepository
  getCustomerAddressByIdRepository: GetCustomerAddressByIdRepository
  getProductStockIntegration: GetProductStockIntegration
  getExpressExchangeByIdRepository: GetExpressExchangeByIdRepository
  updateExpressExchangeRepository: UpdateExpressExchangeRepository
  checkInvoiceWarranty: CheckInvoiceWarrantyIntegration
}

const makeSut = (): SutType => {
  const getInvoiceByIdWithProductIdsRepository =
    new GetInvoiceByIdWithProductIdsRepositoryStub()
  const getProductByIdRepository = new GetProductByIdRepositoryStub()
  const getCustomerAddressByIdRepository =
    new GetCustomerAddressByIdRepositoryStub()
  const getProductStockIntegration = new GetProductStockIntegrationStub()
  const getExpressExchangeByIdRepository =
    new GetExpressExchangeByIdRepositoryStub()
  const updateExpressExchangeRepository =
    new UpdateExpressExchangeRepositoryStub()
  const checkInvoiceWarranty = new CheckInvoiceWarrantyIntegrationStub()
  const sut = new EditExpressExchange(
    getInvoiceByIdWithProductIdsRepository,
    getProductByIdRepository,
    getCustomerAddressByIdRepository,
    getProductStockIntegration,
    getExpressExchangeByIdRepository,
    updateExpressExchangeRepository,
    checkInvoiceWarranty,
  )

  // creation of sut with setup for success flow
  const customer = mockCustomer()
  const currentCustomerAddress = mockCustomerAddress()
  const updatedCustomerAddress = mockCustomerAddress()
  currentCustomerAddress.customerId = customer.id
  updatedCustomerAddress.customerId = customer.id
  const currentProduct = mockProductExpressExchangeAvailable()
  const updatedProduct = mockProductExpressExchangeAvailable()
  const invoice = mockInvoice()
  const invoiceWithProductIds = mockInvoiceWithProductIds()
  invoiceWithProductIds.id = invoice.id
  invoiceWithProductIds.customerId = customer.id
  invoiceWithProductIds.invoiceProducts.push(
    { productId: currentProduct.id },
    { productId: updatedProduct.id },
  )
  let currentExpressExchange = mockExpressExchange()
  currentExpressExchange = {
    ...currentExpressExchange,
    ...currentCustomerAddress,
    customerId: customer.id,
    invoiceId: invoice.id,
    productId: currentProduct.id,
  }
  let updatedExpressExchange = {
    ...currentExpressExchange,
    ...updatedCustomerAddress,
    customerId: customer.id,
    invoiceId: invoice.id,
    productId: updatedProduct.id,
  }

  const editExpressExchangeParams: EditExpressExchangeParams = {
    customerId: customer.id,
    expressExchangeId: currentExpressExchange.id,
    productId: updatedProduct.id,
    customerAddressId: updatedCustomerAddress.id,
  }
  jest
    .spyOn(getExpressExchangeByIdRepository, 'getById')
    .mockResolvedValue(currentExpressExchange)
  jest
    .spyOn(getInvoiceByIdWithProductIdsRepository, 'getByIdWithProductIds')
    .mockResolvedValue(invoiceWithProductIds)
  jest
    .spyOn(getProductByIdRepository, 'getById')
    .mockResolvedValue(updatedProduct)
  jest
    .spyOn(getCustomerAddressByIdRepository, 'getCustomerAddressById')
    .mockResolvedValue(updatedCustomerAddress)
  jest
    .spyOn(updateExpressExchangeRepository, 'update')
    .mockResolvedValue(updatedExpressExchange)

  return {
    sut,
    editExpressExchangeParams,
    currentExpressExchange,
    updatedExpressExchange,
    updatedCustomerAddress,
    updatedProduct,
    invoiceWithProductIds,
    getInvoiceByIdWithProductIdsRepository,
    getProductByIdRepository,
    getCustomerAddressByIdRepository,
    getProductStockIntegration,
    updateExpressExchangeRepository,
    checkInvoiceWarranty,
    getExpressExchangeByIdRepository,
  }
}

describe('Edit Express Exchange Use Case', () => {
  test('Should return an express exchange updated with data related to params on success', async () => {
    const { sut, editExpressExchangeParams, updatedCustomerAddress } = makeSut()

    const expressExchangeEdited = await sut.edit(editExpressExchangeParams)
    const { createdAt, updatedAt, ...updatedCustomerAddressWithoutDates } =
      updatedCustomerAddress

    expect(expressExchangeEdited.status).toEqual('processing')
    expect(expressExchangeEdited.customerId).toEqual(
      editExpressExchangeParams.customerId,
    )
    expect(expressExchangeEdited.productId).toEqual(
      editExpressExchangeParams.productId,
    )
    expect(expressExchangeEdited).toMatchObject(
      updatedCustomerAddressWithoutDates,
    )
  })

  test('Should throw if missing update data is provided', async () => {
    const { sut, editExpressExchangeParams, updatedCustomerAddress } = makeSut()

    const promise = sut.edit({
      customerId: editExpressExchangeParams.customerId,
      expressExchangeId: editExpressExchangeParams.expressExchangeId,
    })
    expect(promise).rejects.toThrow(MissingUpdateDataError)
  })

  test('Should call getExpressExchangeByIdRepository with correct params', async () => {
    const { sut, editExpressExchangeParams, getExpressExchangeByIdRepository } =
      makeSut()
    const getByIdWithProductIdsSpy = jest.spyOn(
      getExpressExchangeByIdRepository,
      'getById',
    )
    await sut.edit(editExpressExchangeParams)

    expect(getByIdWithProductIdsSpy).toHaveBeenCalledWith(
      editExpressExchangeParams.expressExchangeId,
      editExpressExchangeParams.customerId,
    )
  })

  test('Should throw if getExpressExchangeByIdRepository returns undefined', async () => {
    const { sut, editExpressExchangeParams, getExpressExchangeByIdRepository } =
      makeSut()
    jest
      .spyOn(getExpressExchangeByIdRepository, 'getById')
      .mockResolvedValueOnce(undefined)
    const promise = sut.edit(editExpressExchangeParams)

    expect(promise).rejects.toThrow(ItemNotFoundError)
  })

  test('Should throw if express exchange has status different than processing returns undefined', async () => {
    const {
      sut,
      editExpressExchangeParams,
      getExpressExchangeByIdRepository,
      currentExpressExchange,
    } = makeSut()
    currentExpressExchange.status = 'sent'
    jest
      .spyOn(getExpressExchangeByIdRepository, 'getById')
      .mockResolvedValueOnce(currentExpressExchange)
    const promise = sut.edit(editExpressExchangeParams)

    expect(promise).rejects.toThrow(ExpressExchangeCantBeEditedError)
  })

  test('Should call getInvoiceByIdWithProductIdsRepository with correct params', async () => {
    const {
      sut,
      currentExpressExchange,
      editExpressExchangeParams,
      getInvoiceByIdWithProductIdsRepository,
    } = makeSut()
    const getByIdWithProductIdsSpy = jest.spyOn(
      getInvoiceByIdWithProductIdsRepository,
      'getByIdWithProductIds',
    )
    await sut.edit(editExpressExchangeParams)

    expect(getByIdWithProductIdsSpy).toHaveBeenCalledWith(
      currentExpressExchange.invoiceId,
      editExpressExchangeParams.customerId,
    )
  })

  test('Should throw if getInvoiceByIdWithProductIdsRepository returns undefined', async () => {
    const {
      sut,
      editExpressExchangeParams,
      getInvoiceByIdWithProductIdsRepository,
    } = makeSut()
    jest
      .spyOn(getInvoiceByIdWithProductIdsRepository, 'getByIdWithProductIds')
      .mockResolvedValueOnce(undefined)
    const promise = sut.edit(editExpressExchangeParams)

    expect(promise).rejects.toThrow(ItemNotFoundError)
  })

  test('Should throw if invoice doesnt contain the product', async () => {
    const {
      sut,
      editExpressExchangeParams,
      getInvoiceByIdWithProductIdsRepository,
    } = makeSut()
    jest
      .spyOn(getInvoiceByIdWithProductIdsRepository, 'getByIdWithProductIds')
      .mockResolvedValueOnce(mockInvoiceWithProductIds())
    const promise = sut.edit(editExpressExchangeParams)

    expect(promise).rejects.toThrow(InvoiceDoesNotContainTheProductError)
  })

  test('Should call checkInvoiceWarranty with correct params', async () => {
    const {
      sut,
      editExpressExchangeParams,
      checkInvoiceWarranty,
      invoiceWithProductIds,
    } = makeSut()
    const checkSpy = jest.spyOn(checkInvoiceWarranty, 'check')
    await sut.edit(editExpressExchangeParams)

    expect(checkSpy).toHaveBeenCalledWith(
      invoiceWithProductIds.number,
      invoiceWithProductIds.serie,
    )
  })

  test('Should throw if invoice warranty expired', async () => {
    const { sut, editExpressExchangeParams, checkInvoiceWarranty } = makeSut()
    jest
      .spyOn(checkInvoiceWarranty, 'check')
      .mockResolvedValueOnce(mockInvoiceWarrantyCheckFalse())
    const promise = sut.edit(editExpressExchangeParams)

    expect(promise).rejects.toThrow(InvoiceWarrantyExpiredError)
  })

  test('Should call getProductById with correct params', async () => {
    const { sut, editExpressExchangeParams, getProductByIdRepository } =
      makeSut()
    const getProductByIdSpy = jest.spyOn(getProductByIdRepository, 'getById')
    await sut.edit(editExpressExchangeParams)

    expect(getProductByIdSpy).toHaveBeenCalledWith(
      editExpressExchangeParams.productId,
    )
  })

  test('Should throw if getProductById returns undefined', async () => {
    const { sut, editExpressExchangeParams, getProductByIdRepository } =
      makeSut()
    jest
      .spyOn(getProductByIdRepository, 'getById')
      .mockResolvedValueOnce(undefined)
    const promise = sut.edit(editExpressExchangeParams)

    expect(promise).rejects.toThrow(ItemNotFoundError)
  })

  test('Should throw if product doesnt have express exchange available', async () => {
    const { sut, editExpressExchangeParams, getProductByIdRepository } =
      makeSut()
    jest
      .spyOn(getProductByIdRepository, 'getById')
      .mockResolvedValueOnce(mockProductExpressExchangeUnavailable())
    const promise = sut.edit(editExpressExchangeParams)

    expect(promise).rejects.toThrow(ExpressExchangeProductUnavailableError)
  })

  test('Should call getProductById with correct params', async () => {
    const {
      sut,
      editExpressExchangeParams,
      getProductStockIntegration,
      updatedProduct,
    } = makeSut()
    const getProductStockSpy = jest.spyOn(
      getProductStockIntegration,
      'getProductStock',
    )
    await sut.edit(editExpressExchangeParams)

    expect(getProductStockSpy).toHaveBeenCalledWith(updatedProduct.sku)
  })

  test('Should throw if product is out of stock', async () => {
    const { sut, editExpressExchangeParams, getProductStockIntegration } =
      makeSut()
    jest
      .spyOn(getProductStockIntegration, 'getProductStock')
      .mockResolvedValueOnce({ stock: 0 })
    const promise = sut.edit(editExpressExchangeParams)

    expect(promise).rejects.toThrow(ProductOutOfStockError)
  })

  test('Should call getCustomerAddresById with correct params', async () => {
    const { sut, editExpressExchangeParams, getCustomerAddressByIdRepository } =
      makeSut()
    const getCustomerAddressByIdSpy = jest.spyOn(
      getCustomerAddressByIdRepository,
      'getCustomerAddressById',
    )
    await sut.edit(editExpressExchangeParams)

    expect(getCustomerAddressByIdSpy).toHaveBeenCalledWith(
      editExpressExchangeParams.customerAddressId,
      editExpressExchangeParams.customerId,
    )
  })

  test('Should throw if customer address not found', async () => {
    const { sut, editExpressExchangeParams, getCustomerAddressByIdRepository } =
      makeSut()
    jest
      .spyOn(getCustomerAddressByIdRepository, 'getCustomerAddressById')
      .mockResolvedValueOnce(undefined)
    const promise = sut.edit(editExpressExchangeParams)

    expect(promise).rejects.toThrow(ItemNotFoundError)
  })

  test('Should call updateExpressExchangeRepository with correct params', async () => {
    const {
      sut,
      editExpressExchangeParams,
      updateExpressExchangeRepository,
      updatedProduct,
      updatedCustomerAddress,
    } = makeSut()
    const updateSpy = jest.spyOn(updateExpressExchangeRepository, 'update')

    const editExpressExchangeData: UpdateExpressExchangeData = {
      productId: updatedProduct.id,
      streetAddress: updatedCustomerAddress.streetAddress,
      streetAddressLine2: updatedCustomerAddress.streetAddressLine2,
      houseNumber: updatedCustomerAddress.houseNumber,
      district: updatedCustomerAddress.district,
      city: updatedCustomerAddress.city,
      state: updatedCustomerAddress.state,
    }

    await sut.edit(editExpressExchangeParams)

    expect(updateSpy).toHaveBeenCalledWith(
      editExpressExchangeData,
      editExpressExchangeParams.expressExchangeId,
      editExpressExchangeParams.customerId,
    )
  })
})
