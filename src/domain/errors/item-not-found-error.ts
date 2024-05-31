export class ItemNotFoundError extends Error {
  constructor(itemType: string, itemId: string) {
    super(`${itemType} with id ${itemId} not found`)
    this.name = 'ItemNotFound'
  }
}
