import { DrizzleConfig } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

const postgresDbUrl =
  process.env.POSTGRES_DB_URL ??
  'postgresql://postgres:postgres@127.0.0.1:5432/postgres'

export async function runMigrations(
  postgresDbUrl: string,
  postgresConfig?: postgres.Options<{}>,
  drizzleConfig?: DrizzleConfig,
) {
  const sql = postgres(postgresDbUrl, { max: 1, ...postgresConfig })
  const db = drizzle(sql, drizzleConfig)
  await migrate(db, { migrationsFolder: 'drizzle/migrations' })
  await sql.end()
}

runMigrations(postgresDbUrl).then()
