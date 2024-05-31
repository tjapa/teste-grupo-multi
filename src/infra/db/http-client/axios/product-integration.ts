import {
  GetProductStockIntegration,
  ProductStock,
} from '@/integration/product/get-product-stock-integration'
import { sacExpressExchangesClient } from './sac-express-exchanges-api-axios-client'

export class ProductIntegration implements GetProductStockIntegration {
  async getProductStock(sku: string): Promise<ProductStock> {
    const params = new URLSearchParams({ sku })
    const response = await sacExpressExchangesClient.get('products/stock', {
      params,
    })
    return response.data
  }
}
