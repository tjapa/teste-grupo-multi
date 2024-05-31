export type ProductStock = {
  stock: number
}

export interface GetProductStockIntegration {
  getProductStock: (sku: string) => Promise<ProductStock>
}
