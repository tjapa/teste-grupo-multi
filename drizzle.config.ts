import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/infra/db/drizzle/schemas/index.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url:
      process.env.POSTGRES_DB_URL ??
      'postgresql://postgres:postgres@127.0.0.1:5432/postgres',
  },
  verbose: false,
  strict: false,
  schemaFilter: ['public'],
})
