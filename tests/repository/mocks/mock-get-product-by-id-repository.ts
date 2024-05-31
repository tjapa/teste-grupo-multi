import { GetProductByIdRepository } from '@/repository/product/get-product-by-id-repository'
import { Product } from '@/domain/models/product'
import { mockProductExpressExchangeAvailable } from '@/tests/domain/mocks/mock-product'

export class GetProductByIdRepositoryStub implements GetProductByIdRepository {
  async getById(productId: string): Promise<Product | undefined> {
    return mockProductExpressExchangeAvailable()
  }
}
