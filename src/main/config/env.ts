import 'dotenv/config'

export const env = {
  port: process.env.PORT ?? '3000',
  postgresDbUrl:
    process.env.POSTGRES_DB_URL ??
    'postgresql://postgres:postgres@127.0.0.1:5432/postgres',
  redisHost: process.env.REDIS_HOST ?? '127.0.0.1',
  redisPort: process.env.REDIS_PORT ?? '6379',
  redisUsername: process.env.REDIS_USERNAME ?? 'default',
  redisPassword: process.env.REDIS_PASSWORD ?? 'redis',
}
