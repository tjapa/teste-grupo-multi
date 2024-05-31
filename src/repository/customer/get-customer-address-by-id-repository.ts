import { CustomerAddress } from '@/domain/models/customer'

export interface GetCustomerAddressByIdRepository {
  getCustomerAddressById: (
    customerAddressId: string,
    customerId: string,
  ) => Promise<CustomerAddress | undefined>
}
