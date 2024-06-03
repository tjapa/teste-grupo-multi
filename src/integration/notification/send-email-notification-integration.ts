export type EmailNotification = {
  email: string
  subject: string
  body: string
}

export interface SendEmailNotificationIntegration {
  send: (emailNotification: EmailNotification) => Promise<boolean>
}
