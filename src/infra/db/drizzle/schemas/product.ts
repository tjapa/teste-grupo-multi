import { relations } from 'drizzle-orm'
import {
  pgTable,
  varchar,
  timestamp,
  decimal,
  boolean,
  uuid,
} from 'drizzle-orm/pg-core'
import { invoiceProducts } from './invoice'
import { expressExchanges } from './express-exchange'

export const products = pgTable('products', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  sku: varchar('sku', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  isExpressExchangeAvailable: boolean(
    'is_express_exchange_available',
  ).notNull(),
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

export const productRelations = relations(products, ({ many }) => ({
  invoiceProducts: many(invoiceProducts),
  expressExchanges: many(expressExchanges),
}))
