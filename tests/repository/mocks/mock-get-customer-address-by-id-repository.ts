import { CustomerAddress } from '@/domain/models/customer'
import { GetCustomerAddressByIdRepository } from '@/repository/customer/get-customer-address-by-id-repository'
import { mockCustomerAddress } from '@/tests/domain/mocks/mock-customer'

export class GetCustomerAddressByIdRepositoryStub
  implements GetCustomerAddressByIdRepository
{
  async getCustomerAddressById(
    customerAddressId: string,
    customerId: string,
  ): Promise<CustomerAddress | undefined> {
    return mockCustomerAddress()
  }
}
