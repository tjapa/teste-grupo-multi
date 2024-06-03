import { Customer, CustomerAddress } from '@/domain/models/customer'
import { GetCustomerAddressByIdRepository } from '@/repository/customer/get-customer-address-by-id-repository'
import { customerAddresses, customers } from './schemas'
import { and, eq } from 'drizzle-orm'
import { drizzleClient } from './dizzleClient'
import { HandleInvalidUuidError } from './decorators/handle-invalid-uuid-error'
import { GetCustomerByIdRepository } from '@/repository/customer/get-customer-by-id-repository'

export class CustomerRepository
  implements GetCustomerByIdRepository, GetCustomerAddressByIdRepository {
  @HandleInvalidUuidError
  async getCustomerById(customerId: string): Promise<Customer | undefined> {
    return await drizzleClient.query.customers.findFirst({
      where: eq(customers.id, customerId),
    })
  }

  @HandleInvalidUuidError
  async getCustomerAddressById(
    customerAddressId: string,
    customerId: string,
  ): Promise<CustomerAddress | undefined> {
    return await drizzleClient.query.customerAddresses.findFirst({
      where: and(
        eq(customerAddresses.id, customerAddressId),
        eq(customerAddresses.customerId, customerId),
      ),
    })
  }
}
