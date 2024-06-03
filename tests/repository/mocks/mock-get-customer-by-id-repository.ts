import { Customer } from '@/domain/models/customer'
import { GetCustomerByIdRepository } from '@/repository/customer/get-customer-by-id-repository'
import { mockCustomer } from '@/tests/domain/mocks/mock-customer'

export class GetCustomerByIdRepositoryStub
  implements GetCustomerByIdRepository
{
  async getCustomerById(customerId: string): Promise<Customer | undefined> {
    return mockCustomer()
  }
}
