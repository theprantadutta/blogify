import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import redis, { REDIS_LOGIN_KEY } from '../../util/redis'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const userId = await redis.get(REDIS_LOGIN_KEY)

    const user = await prisma.user.findFirst({
      where: {
        id: parseInt(userId),
      },
    })
    delete user.password
    return res.status(200).json(user)
  } catch (e) {
    return res.status(200).json({})
  }
}
