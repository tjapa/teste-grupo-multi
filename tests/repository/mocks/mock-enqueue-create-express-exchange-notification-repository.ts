import { EnqueueCreateExpressExchangeNotificationRepository } from '../notification/enqueue-create-express-exchange-notification'

export class EnqueueCreateExpressExchangeNotificationRepositoryStub
  implements EnqueueCreateExpressExchangeNotificationRepository {
  async enqueueCreateExpressExchangeNotification(
    expressExchangeId: string,
    customerId: string,
  ): Promise<void> {
    return
  }
}
