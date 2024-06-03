import {
  NotificationQueue,
  notifExpressExchangeQueue,
} from '@/infra/bullmq/notification-queue'
import { redisClient } from '@/infra/db/ioredis/connection'

describe('Notification Queue', () => {
  afterAll(async () => {
    await redisClient.quit()
  })

  beforeEach(async () => {
    await notifExpressExchangeQueue.drain()
  })

  const makeSut = (): NotificationQueue => {
    return new NotificationQueue()
  }

  describe('enqueueCreateExpressExchangeNotification()', () => {
    test('Should enqueue a create express exchange notification', async () => {
      const sut = makeSut()

      await sut.enqueueCreateExpressExchangeNotification('any_id', 'any_id')

      const counts = await notifExpressExchangeQueue.getJobCounts('wait')

      expect(counts.wait).toBe(1)
    })
  })
})
