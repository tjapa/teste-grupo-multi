import { Customer } from '@/domain/models/customer'

export interface GetCustomerByIdRepository {
  getCustomerById: (customerId: string) => Promise<Customer | undefined>
}
