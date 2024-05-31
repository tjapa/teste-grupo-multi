export type Customer = {
  id: string
  email: string
  cpf: string
  phone: string
  createdAt: Date
  updatedAt: Date
}

export type CustomerAddress = {
  id: string
  customerId: string
  streetAddress: string
  streetAddressLine2?: string | null
  houseNumber: string
  district: string
  city: string
  state: string
  createdAt: Date
  updatedAt: Date
}
