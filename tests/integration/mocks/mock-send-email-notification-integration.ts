import {
  EmailNotification,
  SendEmailNotificationIntegration,
} from '../notification/send-email-notification-integration'

export class SendEmailNotificationIntegrationStub
  implements SendEmailNotificationIntegration
{
  async send(emailNotification: EmailNotification): Promise<boolean> {
    return true
  }
}
