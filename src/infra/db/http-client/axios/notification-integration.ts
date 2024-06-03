import {
  EmailNotification,
  SendEmailNotificationIntegration,
} from '@/integration/notification/send-email-notification-integration'
import { sacExpressExchangesClient } from './sac-express-exchanges-api-axios-client'

export class NotificationIntegration
  implements SendEmailNotificationIntegration {
  async send(emailNotification: EmailNotification): Promise<boolean> {
    try {
      const response = await sacExpressExchangesClient.post(
        'notifications',
        emailNotification,
      )
      return response?.data?.message === 'Success'
    } catch (error) {
      console.log(error)
      return false
    }
  }
}
