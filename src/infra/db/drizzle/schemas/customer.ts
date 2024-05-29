import { relations } from 'drizzle-orm'
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core'
import { invoices } from './invoice'
import { expressExchanges } from './express-exchange'

export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  cpf: varchar('cpf', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', {
    precision: 6,
    mode: 'date',
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', {
    precision: 6,
    mode: 'date',
  })
    .defaultNow()
    .notNull(),
})

export const customerRelations = relations(customers, ({ many }) => ({
  addresses: many(customerAddresses),
  invoices: many(invoices),
  expressExchanges: many(expressExchanges),
}))

export const customerAddresses = pgTable('customer_addresses', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  customerId: uuid('customer_id')
    .references(() => customers.id)
    .notNull(),
  streetAddress: varchar('street_address', { length: 255 }).notNull(),
  streetAddressLine2: varchar('street_address_line_2', { length: 255 }),
  houseNumber: varchar('house_number', { length: 255 }).notNull(),
  district: varchar('district', { length: 255 }).notNull(),
  city: varchar('city', { length: 255 }).notNull(),
  state: varchar('state', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', {
    precision: 6,
    mode: 'date',
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', {
    precision: 6,
    mode: 'date',
  })
    .defaultNow()
    .notNull(),
})

export const customerAddressRelations = relations(
  customerAddresses,
  ({ one }) => ({
    customer: one(customers, {
      fields: [customerAddresses.customerId],
      references: [customers.id],
    }),
  }),
)
