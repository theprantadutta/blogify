import Redis from 'ioredis'
const redis = new Redis()

export const REDIS_LOGIN_KEY = 'userId'

export const TTL = 1 * 60 * 60 * 2 // 2 hours

export default redis
