import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import redis, { REDIS_LOGIN_KEY } from '../../util/redis'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let { page } = req.body

  if (!page) {
    return res.status(422).json({
      error: 'Please Provide Page Information',
    })
  }

  page = parseInt(page)
  const take = 3
  let skip = (page - 1) * take

  const userId = await redis.get(REDIS_LOGIN_KEY)

  if (!userId) {
    return res.status(419).json({
      error: 'You are not authenticated',
    })
  }

  try {
    const posts = await prisma.post.findMany({
      take,
      skip,
      where: {
        userId: parseInt(userId),
      },
    })

    let postCount = await prisma.post.count({
      where: {
        userId: parseInt(userId),
      },
    })

    return res
      .status(200)
      .json({ posts, isNextPage: postCount - (skip + take) > 0 })
  } catch (e) {
    return res.status(422).json({
      error: 'Something Went Wrong',
    })
  }
}
