import { Queue } from 'bullmq'
import { redisClient } from '../db/ioredis/connection'
import { EnqueueCreateExpressExchangeNotificationRepository } from '@/repository/notification/enqueue-create-express-exchange-notification'

export type NotifExpressExchangeQueueData = {
  expressExchangeId: string
  customerId: string
}
export const notifExpressExchangeQueueName =
  'notification-express-exchange-queue'
export const notifExpressExchangeQueue =
  new Queue<NotifExpressExchangeQueueData>(notifExpressExchangeQueueName, {
    defaultJobOptions: { attempts: 5 },
    connection: redisClient,
  })

export class NotificationQueue
  implements EnqueueCreateExpressExchangeNotificationRepository
{
  async enqueueCreateExpressExchangeNotification(
    expressExchangeId: string,
    customerId: string,
  ): Promise<void> {
    await notifExpressExchangeQueue.add(
      `create-express-exchage-${expressExchangeId}`,
      {
        expressExchangeId,
        customerId,
      },
      {
        removeOnComplete: true,
        backoff: {
          type: 'exponential',
          delay: 60 * 1000,
        },
      },
    )
  }
}
