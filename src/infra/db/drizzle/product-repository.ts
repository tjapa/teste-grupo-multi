import { GetProductByIdRepository } from '@/repository/product/get-product-by-id-repository'
import { drizzleClient } from './dizzleClient'
import { products } from './schemas'
import { eq } from 'drizzle-orm'
import { Product } from '@/domain/models/product'
import { HandleInvalidUuidError } from './decorators/handle-invalid-uuid-error'

export class ProductRepository implements GetProductByIdRepository {
  @HandleInvalidUuidError
  async getById(productId: string): Promise<Product | undefined> {
    return await drizzleClient.query.products.findFirst({
      where: eq(products.id, productId),
    })
  }
}
