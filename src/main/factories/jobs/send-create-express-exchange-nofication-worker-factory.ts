import { SendCreateExpressExchangeNotification } from '@/domain/use-cases/express-exchange/send-create-express-exchange-notification-use-case'
import {
  NotifExpressExchangeQueueData,
  notifExpressExchangeQueueName,
} from '@/infra/bullmq/notification-queue'
import { CustomerRepository } from '@/infra/db/drizzle/customer-repository'
import { ExpressExchangeRepository } from '@/infra/db/drizzle/express-exchange-repository'
import { NotificationIntegration } from '@/infra/db/http-client/axios/notification-integration'
import { redisClient } from '@/infra/db/ioredis/connection'
import { Worker, Job } from 'bullmq'

export const makeSendCreateExpressExchangeNotificationWorker = () => {
  const expressExchangeRepository = new ExpressExchangeRepository()
  const customerRepository = new CustomerRepository()
  const notificationIntegration = new NotificationIntegration()

  const sendCreateExpressExchangeNotification =
    new SendCreateExpressExchangeNotification(
      expressExchangeRepository,
      customerRepository,
      notificationIntegration,
    )
  const worker = new Worker<NotifExpressExchangeQueueData>(
    notifExpressExchangeQueueName,
    async (job: Job<NotifExpressExchangeQueueData>) => {
      console.log(`Running SendCreateExpressExchageNotification job`)
      const isSent = await sendCreateExpressExchangeNotification.send(
        job.data.expressExchangeId,
        job.data.customerId,
      )
      if (!isSent) {
        await job.moveToFailed(new Error('Notification sent failed'), job.id!)
      }
      return true
    },
    {
      autorun: false,
      connection: redisClient,
      removeOnComplete: { count: 0 },
    },
  )

  return worker
}
