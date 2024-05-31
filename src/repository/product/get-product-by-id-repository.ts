import { Product } from '@/domain/models/product'

export interface GetProductByIdRepository {
  getById: (productId: string) => Promise<Product | undefined>
}
