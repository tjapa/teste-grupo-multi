export class MissingUpdateDataError extends Error {
  constructor() {
    super(`Missing update data`)
    this.name = 'MissingUpdateDataError'
  }
}
