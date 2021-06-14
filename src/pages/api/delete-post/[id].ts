import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import redis, { REDIS_LOGIN_KEY } from '../../../util/redis'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const id = parseInt(req.query.id as any)

  if (!id) {
    return res.status(419).json({
      error: 'Please Provide a PostID',
    })
  }

  const userId = await redis.get(REDIS_LOGIN_KEY)

  try {
    const post = await prisma.post.delete({
      where: {
        id,
      },
    })
    return res.status(200).json(post)
  } catch (e) {
    return res.status(422).json({
      error: 'Something Went Wrong',
    })
  }
}
