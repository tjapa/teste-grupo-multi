import { Redis } from 'ioredis'
import { env } from '@/main/config/env'

export const redisClient = new Redis(Number(env.redisPort), env.redisHost, {
  username: env.redisUsername,
  password: env.redisPassword,
  maxRetriesPerRequest: null,
})
