import 'dotenv/config'

export const env = {
  port: process.env.PORT ?? '3000',
  postgresDbUrl:
    process.env.POSTGRES_DB_URL ??
    'postgresql://postgres:postgres@127.0.0.1:5432/postgres',
}
