import { NextApiResponse } from 'next'
import { withIronSession } from 'next-iron-session'
import prisma from '../../lib/prisma'
import { NEXT_IRON_SESSION_CONFIG } from '../../util/constants'
import { ExtendedApiRequest } from '../../util/types'

export default withIronSession(
  async (req: ExtendedApiRequest, res: NextApiResponse) => {
    const user = req.session.get('user')

    if (!user) {
      return res.status(419).json({
        error: 'You are not authenticated',
      })
    }

    let { page } = req.body

    if (!page) {
      return res.status(422).json({
        error: 'Please Provide Page Information',
      })
    }

    page = parseInt(page)
    const take = 3
    let skip = (page - 1) * take

    try {
      const posts = await prisma.post.findMany({
        take,
        skip,
        orderBy: {
          createdAt: 'desc',
        },
      })
      let postCount = await prisma.post.count()

      return res
        .status(200)
        .json({ posts, isNextPage: postCount - (skip + take) > 0 })
    } catch (e) {
      return res.status(422).json({
        error: 'Something Went Wrong',
      })
    }
  },
  NEXT_IRON_SESSION_CONFIG
)
