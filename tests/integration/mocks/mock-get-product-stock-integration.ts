import {
  GetProductStockIntegration,
  ProductStock,
} from '@/integration/product/get-product-stock-integration'

export const mockProductStock = (): ProductStock => ({
  stock: 100,
})

export const mockProductOutOfStock = (): ProductStock => ({
  stock: 0,
})

export class GetProductStockIntegrationStub
  implements GetProductStockIntegration
{
  async getProductStock(sku: string): Promise<ProductStock> {
    return mockProductStock()
  }
}
