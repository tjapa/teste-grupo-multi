import { CustomerAddress } from '@/domain/models/customer'
import { GetCustomerAddressByIdRepository } from '@/repository/customer/get-customer-address-by-id-repository'
import { customerAddresses } from './schemas'
import { and, eq } from 'drizzle-orm'
import { drizzleClient } from './dizzleClient'
import { HandleInvalidUuidError } from './decorators/handle-invalid-uuid-error'

export class CustomerRepository implements GetCustomerAddressByIdRepository {
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
