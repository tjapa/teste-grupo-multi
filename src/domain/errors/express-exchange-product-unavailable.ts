export class ExpressExchangeProductUnavailableError extends Error {
  constructor(productId: string) {
    super(
      `Product with id ${productId} doesn't have the express exchange available`,
    )
    this.name = 'ExpressExchangeProductUnavailable'
  }
}
