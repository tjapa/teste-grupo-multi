export interface EnqueueCreateExpressExchangeNotificationRepository {
  enqueueCreateExpressExchangeNotification: (
    expressExchangeId: string,
    customerId: string,
  ) => Promise<void>
}
