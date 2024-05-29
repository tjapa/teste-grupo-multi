import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  primaryKey,
} from 'drizzle-orm/pg-core'
import { customers } from './customer'
import { relations } from 'drizzle-orm'
import { products } from './product'
import { expressExchanges } from './express-exchange'

export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  number: varchar('number', { length: 255 }).notNull(),
  serie: varchar('serie', { length: 255 }).notNull(),
  customerId: uuid('customer_id')
    .references(() => customers.id)
    .notNull(),
  purchaseDate: timestamp('purchase_date', {
    precision: 6,
    mode: 'date',
  })
    .defaultNow()
    .notNull(),
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

export const invoiceRelations = relations(invoices, ({ one, many }) => ({
  customer: one(customers, {
    fields: [invoices.customerId],
    references: [customers.id],
  }),
  expressExchanges: many(expressExchanges),
  invoiceProducts: many(invoiceProducts),
}))

export const invoiceProducts = pgTable(
  'invoice_products',
  {
    invoiceId: uuid('invoice_id')
      .references(() => invoices.id)
      .notNull(),
    productId: uuid('product_id')
      .references(() => products.id)
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.invoiceId, t.productId] }),
  }),
)

export const invoiceProductRelations = relations(
  invoiceProducts,
  ({ one }) => ({
    invoice: one(invoices, {
      fields: [invoiceProducts.invoiceId],
      references: [invoices.id],
    }),
    product: one(products, {
      fields: [invoiceProducts.productId],
      references: [products.id],
    }),
  }),
)
