import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schemas'
import { env } from '@/main/config/env'

export const sql = postgres(env.postgresDbUrl, {
  transform: postgres.toCamel,
})

export const drizzleClient = drizzle(sql, {
  schema,
})

export const disconnect = async () => {
  sql.end()
}
