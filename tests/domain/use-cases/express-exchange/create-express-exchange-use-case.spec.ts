import {
  mockCustomer,
  mockCustomerAddress,
} from '@/tests/domain/mocks/mock-customer'
import {
  CreateExpressExchange,
  CreateExpressExchangeParams,
  CreateExpressExchangeUseCase,
} from '@/domain/use-cases/express-exchange/create-express-exchange-use-case'
import { GetInvoiceByIdWithProductIdsRepositoryStub } from '@/tests/repository/mocks/mock-get-invoice-by-id-repository'
import { GetProductByIdRepositoryStub } from '@/tests/repository/mocks/mock-get-product-by-id-repository'
import { GetCustomerAddressByIdRepositoryStub } from '@/tests/repository/mocks/mock-get-customer-address-by-id-repository'
import { GetProductStockIntegrationStub } from '@/tests/integration/mocks/mock-get-product-stock-integration'
import { GetExpressExchangeByInvoiceIdRepositoryReturnUndefinedStub } from '@/tests/repository/mocks/mock-get-express-exchange-by-invoice-id-repository'
import { GetInvoiceByIdWithProductIdsRepository } from '@/repository/invoice/get-invoice-by-id-with-product-ids-repository'
import { GetProductByIdRepository } from '@/repository/product/get-product-by-id-repository'
import { GetCustomerAddressByIdRepository } from '@/repository/customer/get-customer-address-by-id-repository'
import { GetProductStockIntegration } from '@/integration/product/get-product-stock-integration'
import { GetExpressExchangeByInvoiceIdRepository } from '@/repository/express-exchange/get-express-exchange-by-invoice-id-repository'
import { CreateExpressExchangeRepository } from '@/repository/express-exchange/create-express-exchange-repository'
import { CheckInvoiceWarrantyIntegration } from '@/integration/invoice/check-invoice-warranty-integration'
import { CreateExpressExchangeRepositoryStub } from '@/tests/repository/mocks/mock-create-express-exchange-repository'
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
import { ExpressExchangeForInvoiceAlreadyExistsError } from '@/domain/errors/express-exchange-for-invoice-already-exists-error'
import { ExpressExchangeProductUnavailableError } from '@/domain/errors/express-exchange-product-unavailable'
import { EnqueueCreateExpressExchangeNotificationRepositoryStub } from '@/tests/repository/mocks/mock-enqueue-create-express-exchange-notification-repository'
import { EnqueueCreateExpressExchangeNotificationRepository } from '@/repository/notification/enqueue-create-express-exchange-notification'
import { ExpressExchange } from '@/domain/models/express-exchange'

type SutType = {
  sut: CreateExpressExchangeUseCase
  customerAddress: CustomerAddress
  invoiceWithProductIds: InvoiceWithProductIds
  createExpressExchangeParams: CreateExpressExchangeParams
  product: Product
  expressExchange: ExpressExchange
  getInvoiceByIdWithProductIdsRepository: GetInvoiceByIdWithProductIdsRepository
  getProductByIdRepository: GetProductByIdRepository
  getCustomerAddressByIdRepository: GetCustomerAddressByIdRepository
  getProductStockIntegration: GetProductStockIntegration
  getExpressExchangeByInvoiceIdRepository: GetExpressExchangeByInvoiceIdRepository
  createExpressExchangeRepository: CreateExpressExchangeRepository
  checkInvoiceWarranty: CheckInvoiceWarrantyIntegration
  enqueueCreateExpressExchangeNotificationRepository: EnqueueCreateExpressExchangeNotificationRepository
}

const makeSut = (): SutType => {
  const getInvoiceByIdWithProductIdsRepository =
    new GetInvoiceByIdWithProductIdsRepositoryStub()
  const getProductByIdRepository = new GetProductByIdRepositoryStub()
  const getCustomerAddressByIdRepository =
    new GetCustomerAddressByIdRepositoryStub()
  const getProductStockIntegration = new GetProductStockIntegrationStub()
  const getExpressExchangeByInvoiceIdRepository =
    new GetExpressExchangeByInvoiceIdRepositoryReturnUndefinedStub()
  const createExpressExchangeRepository =
    new CreateExpressExchangeRepositoryStub()
  const checkInvoiceWarranty = new CheckInvoiceWarrantyIntegrationStub()
  const enqueueCreateExpressExchangeNotificationRepository =
    new EnqueueCreateExpressExchangeNotificationRepositoryStub()
  const sut = new CreateExpressExchange(
    getInvoiceByIdWithProductIdsRepository,
    getProductByIdRepository,
    getCustomerAddressByIdRepository,
    getProductStockIntegration,
    getExpressExchangeByInvoiceIdRepository,
    createExpressExchangeRepository,
    checkInvoiceWarranty,
    enqueueCreateExpressExchangeNotificationRepository,
  )

  // creation of sut with setup for success flow
  const customer = mockCustomer()
  const customerAddress = mockCustomerAddress()
  customerAddress.customerId = customer.id
  const product = mockProductExpressExchangeAvailable()
  const invoice = mockInvoice()
  const invoiceWithProductIds = mockInvoiceWithProductIds()
  invoiceWithProductIds.id = invoice.id
  invoiceWithProductIds.customerId = customer.id
  invoiceWithProductIds.invoiceProducts.push({ productId: product.id })
  let expressExchange = mockExpressExchange()
  expressExchange = {
    ...expressExchange,
    ...customerAddress,
    customerId: customer.id,
    invoiceId: invoice.id,
    productId: product.id,
  }
  const createExpressExchangeParams: CreateExpressExchangeParams = {
    customerId: customer.id,
    invoiceId: invoice.id,
    productId: product.id,
    customerAddressId: customerAddress.id,
  }
  jest
    .spyOn(getInvoiceByIdWithProductIdsRepository, 'getByIdWithProductIds')
    .mockResolvedValue(invoiceWithProductIds)
  jest.spyOn(getProductByIdRepository, 'getById').mockResolvedValue(product)
  jest
    .spyOn(createExpressExchangeRepository, 'create')
    .mockResolvedValue(expressExchange)

  return {
    sut,
    createExpressExchangeParams,
    customerAddress,
    product,
    expressExchange,
    invoiceWithProductIds,
    getInvoiceByIdWithProductIdsRepository,
    getProductByIdRepository,
    getCustomerAddressByIdRepository,
    getProductStockIntegration,
    getExpressExchangeByInvoiceIdRepository,
    createExpressExchangeRepository,
    checkInvoiceWarranty,
    enqueueCreateExpressExchangeNotificationRepository,
  }
}

describe('Create Express Exchange Use Case', () => {
  test('Should return a new express exchange with status "processing" and data related to params on success', async () => {
    const { sut, createExpressExchangeParams, customerAddress } = makeSut()

    const expressExchangeCreated = await sut.create(createExpressExchangeParams)
    const { createdAt, updatedAt, ...customerAddressWithoutDates } =
      customerAddress

    expect(expressExchangeCreated.status).toEqual('processing')
    expect(expressExchangeCreated.customerId).toEqual(
      createExpressExchangeParams.customerId,
    )
    expect(expressExchangeCreated.productId).toEqual(
      createExpressExchangeParams.productId,
    )
    expect(expressExchangeCreated.invoiceId).toEqual(
      createExpressExchangeParams.invoiceId,
    )
    expect(expressExchangeCreated).toMatchObject(customerAddressWithoutDates)
  })

  test('Should call getInvoiceByIdWithProductIdsRepository with correct params', async () => {
    const {
      sut,
      createExpressExchangeParams,
      getInvoiceByIdWithProductIdsRepository,
    } = makeSut()
    const getByIdWithProductIdsSpy = jest.spyOn(
      getInvoiceByIdWithProductIdsRepository,
      'getByIdWithProductIds',
    )
    await sut.create(createExpressExchangeParams)

    expect(getByIdWithProductIdsSpy).toHaveBeenCalledWith(
      createExpressExchangeParams.invoiceId,
      createExpressExchangeParams.customerId,
    )
  })

  test('Should throw if getInvoiceByIdWithProductIdsRepository returns undefined', async () => {
    const {
      sut,
      createExpressExchangeParams,
      getInvoiceByIdWithProductIdsRepository,
    } = makeSut()
    jest
      .spyOn(getInvoiceByIdWithProductIdsRepository, 'getByIdWithProductIds')
      .mockResolvedValueOnce(undefined)
    const promise = sut.create(createExpressExchangeParams)

    expect(promise).rejects.toThrow(ItemNotFoundError)
  })

  test('Should throw if invoice doesnt contain the product', async () => {
    const {
      sut,
      createExpressExchangeParams,
      getInvoiceByIdWithProductIdsRepository,
    } = makeSut()
    jest
      .spyOn(getInvoiceByIdWithProductIdsRepository, 'getByIdWithProductIds')
      .mockResolvedValueOnce(mockInvoiceWithProductIds())
    const promise = sut.create(createExpressExchangeParams)

    expect(promise).rejects.toThrow(InvoiceDoesNotContainTheProductError)
  })

  test('Should call checkInvoiceWarranty with correct params', async () => {
    const {
      sut,
      createExpressExchangeParams,
      checkInvoiceWarranty,
      invoiceWithProductIds,
    } = makeSut()
    const checkSpy = jest.spyOn(checkInvoiceWarranty, 'check')
    await sut.create(createExpressExchangeParams)

    expect(checkSpy).toHaveBeenCalledWith(
      invoiceWithProductIds.number,
      invoiceWithProductIds.serie,
    )
  })

  test('Should throw if invoice warranty expired', async () => {
    const { sut, createExpressExchangeParams, checkInvoiceWarranty } = makeSut()
    jest
      .spyOn(checkInvoiceWarranty, 'check')
      .mockResolvedValueOnce(mockInvoiceWarrantyCheckFalse())
    const promise = sut.create(createExpressExchangeParams)

    expect(promise).rejects.toThrow(InvoiceWarrantyExpiredError)
  })

  test('Should call getProductById with correct params', async () => {
    const { sut, createExpressExchangeParams, getProductByIdRepository } =
      makeSut()
    const getProductByIdSpy = jest.spyOn(getProductByIdRepository, 'getById')
    await sut.create(createExpressExchangeParams)

    expect(getProductByIdSpy).toHaveBeenCalledWith(
      createExpressExchangeParams.productId,
    )
  })

  test('Should throw if getProductById returns undefined', async () => {
    const { sut, createExpressExchangeParams, getProductByIdRepository } =
      makeSut()
    jest
      .spyOn(getProductByIdRepository, 'getById')
      .mockResolvedValueOnce(undefined)
    const promise = sut.create(createExpressExchangeParams)

    expect(promise).rejects.toThrow(ItemNotFoundError)
  })

  test('Should throw if product doesnt have express exchange available', async () => {
    const { sut, createExpressExchangeParams, getProductByIdRepository } =
      makeSut()
    jest
      .spyOn(getProductByIdRepository, 'getById')
      .mockResolvedValueOnce(mockProductExpressExchangeUnavailable())
    const promise = sut.create(createExpressExchangeParams)

    expect(promise).rejects.toThrow(ExpressExchangeProductUnavailableError)
  })

  test('Should call getProductStockIntegration with correct params', async () => {
    const {
      sut,
      createExpressExchangeParams,
      getProductStockIntegration,
      product,
    } = makeSut()
    const getProductStockSpy = jest.spyOn(
      getProductStockIntegration,
      'getProductStock',
    )
    await sut.create(createExpressExchangeParams)

    expect(getProductStockSpy).toHaveBeenCalledWith(product.sku)
  })

  test('Should throw if product is out of stock', async () => {
    const { sut, createExpressExchangeParams, getProductStockIntegration } =
      makeSut()
    jest
      .spyOn(getProductStockIntegration, 'getProductStock')
      .mockResolvedValueOnce({ stock: 0 })
    const promise = sut.create(createExpressExchangeParams)

    expect(promise).rejects.toThrow(ProductOutOfStockError)
  })

  test('Should call getExpressExchangeByInvoiceId with correct params', async () => {
    const {
      sut,
      createExpressExchangeParams,
      getExpressExchangeByInvoiceIdRepository,
    } = makeSut()
    const getProductStockSpy = jest.spyOn(
      getExpressExchangeByInvoiceIdRepository,
      'getByInvoiceId',
    )
    await sut.create(createExpressExchangeParams)

    expect(getProductStockSpy).toHaveBeenCalledWith(
      createExpressExchangeParams.invoiceId,
      createExpressExchangeParams.customerId,
    )
  })

  test('Should throw if already exists an express exchange for this invoice', async () => {
    const {
      sut,
      createExpressExchangeParams,
      getExpressExchangeByInvoiceIdRepository,
    } = makeSut()
    jest
      .spyOn(getExpressExchangeByInvoiceIdRepository, 'getByInvoiceId')
      .mockResolvedValueOnce(mockExpressExchange())
    const promise = sut.create(createExpressExchangeParams)

    expect(promise).rejects.toThrow(ExpressExchangeForInvoiceAlreadyExistsError)
  })

  test('Should call getCustomerAddresById with correct params', async () => {
    const {
      sut,
      createExpressExchangeParams,
      getCustomerAddressByIdRepository,
    } = makeSut()
    const getCustomerAddressByIdSpy = jest.spyOn(
      getCustomerAddressByIdRepository,
      'getCustomerAddressById',
    )
    await sut.create(createExpressExchangeParams)

    expect(getCustomerAddressByIdSpy).toHaveBeenCalledWith(
      createExpressExchangeParams.customerAddressId,
      createExpressExchangeParams.customerId,
    )
  })

  test('Should throw if customer address not found', async () => {
    const {
      sut,
      createExpressExchangeParams,
      getCustomerAddressByIdRepository,
    } = makeSut()
    jest
      .spyOn(getCustomerAddressByIdRepository, 'getCustomerAddressById')
      .mockResolvedValueOnce(undefined)
    const promise = sut.create(createExpressExchangeParams)

    expect(promise).rejects.toThrow(ItemNotFoundError)
  })

  test('Should call enqueueCreateExpressExchangeNotificationRepository with correct params', async () => {
    const {
      sut,
      createExpressExchangeParams,
      enqueueCreateExpressExchangeNotificationRepository,
      expressExchange,
    } = makeSut()
    const enqueueCreateExpressExchangeNotificationSpy = jest.spyOn(
      enqueueCreateExpressExchangeNotificationRepository,
      'enqueueCreateExpressExchangeNotification',
    )
    await sut.create(createExpressExchangeParams)

    expect(enqueueCreateExpressExchangeNotificationSpy).toHaveBeenCalledWith(
      expressExchange.id,
      createExpressExchangeParams.customerId,
    )
  })

  test('Should ignore if enqueueCreateExpressExchangeNotificationRepository throws', async () => {
    const {
      sut,
      createExpressExchangeParams,
      enqueueCreateExpressExchangeNotificationRepository,
    } = makeSut()
    jest
      .spyOn(
        enqueueCreateExpressExchangeNotificationRepository,
        'enqueueCreateExpressExchangeNotification',
      )
      .mockRejectedValueOnce(new Error())

    const promise = sut.create(createExpressExchangeParams)

    expect(promise).resolves.toBeTruthy()
  })
})
