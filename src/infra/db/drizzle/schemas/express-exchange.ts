import { relations } from 'drizzle-orm'
import { pgTable, uuid, timestamp, varchar, pgEnum } from 'drizzle-orm/pg-core'
import { invoices } from './invoice'
import { products } from './product'
import { customers } from './customer'

export const expressExchangeStatusEnum = pgEnum('express_exchange_status', [
  'processing',
  'sent',
  'done',
])

export const expressExchanges = pgTable('express_exchanges', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  customerId: uuid('customer_id')
    .references(() => customers.id)
    .notNull(),
  invoiceId: uuid('invoice_id')
    .references(() => invoices.id)
    .notNull()
    .unique(),
  productId: uuid('product_id')
    .references(() => products.id)
    .notNull(),
  status: expressExchangeStatusEnum('status').notNull(),
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

export const expressExchangeRelations = relations(
  expressExchanges,
  ({ one }) => ({
    customer: one(customers, {
      fields: [expressExchanges.customerId],
      references: [customers.id],
    }),
    invoice: one(invoices, {
      fields: [expressExchanges.invoiceId],
      references: [invoices.id],
    }),
    product: one(invoices, {
      fields: [expressExchanges.invoiceId],
      references: [invoices.id],
    }),
  }),
)
