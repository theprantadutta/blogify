import { NextApiRequest, NextApiResponse } from 'next'
import redis, { REDIS_LOGIN_KEY } from '../../util/redis'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await redis.del(REDIS_LOGIN_KEY)
  return res.status(200).end()
}
