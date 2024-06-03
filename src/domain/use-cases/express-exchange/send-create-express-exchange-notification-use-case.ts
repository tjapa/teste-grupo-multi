import {
  EmailNotification,
  SendEmailNotificationIntegration,
} from '@/integration/notification/send-email-notification-integration'
import { GetCustomerByIdRepository } from '@/repository/customer/get-customer-by-id-repository'
import { GetExpressExchangeByIdRepository } from '@/repository/express-exchange/get-express-exchange-by-id-repository'

export interface SendExpressExchangeNotificationUseCase {
  send(expressExchangeId: string, customerId: string): Promise<boolean>
}

export class SendCreateExpressExchangeNotification
  implements SendExpressExchangeNotificationUseCase {
  constructor(
    private readonly getExpressExchangeByIdRepository: GetExpressExchangeByIdRepository,
    private readonly getCustomerByIdRepository: GetCustomerByIdRepository,
    private readonly sendEmailNotificationIntegration: SendEmailNotificationIntegration,
  ) { }

  async send(expressExchangeId: string, customerId: string): Promise<boolean> {
    try {
      const customer =
        await this.getCustomerByIdRepository.getCustomerById(customerId)
      if (!customer) {
        return false
      }

      const expressExchange =
        await this.getExpressExchangeByIdRepository.getById(
          expressExchangeId,
          customerId,
        )
      if (!expressExchange) {
        return false
      }

      const emailNotification: EmailNotification = {
        email: customer.email,
        subject: `Express exchange created!`,
        body: `Express exchange for product ${expressExchange.productId} on invoice ${expressExchange.invoiceId} created`,
      }
      return await this.sendEmailNotificationIntegration.send(emailNotification)
    } catch (error) {
      console.error(error)
      return false
    }
  }
}
