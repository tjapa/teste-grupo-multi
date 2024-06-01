export class ExpressExchangeCantBeDeletedError extends Error {
  constructor(expressExchangeId: string, currentStatus: string) {
    super(
      `Cannot delete Express Exchange ${expressExchangeId}: current status is ${currentStatus}, expected "processing"`,
    )
    this.name = 'ExpressExchangeCantBeDeleted'
  }
}
