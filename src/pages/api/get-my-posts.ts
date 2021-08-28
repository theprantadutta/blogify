import { NextApiResponse } from 'next'
import { withIronSession } from 'next-iron-session'
import prisma from '../../lib/prisma'
import { NEXT_IRON_SESSION_CONFIG } from '../../util/constants'
import { ExtendedApiRequest, ModifiedUser } from '../../util/types'

export default withIronSession(
  async (req: ExtendedApiRequest, res: NextApiResponse) => {
    const user: ModifiedUser = req.session.get('user')

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

    const userId = user.id

    try {
      const posts = await prisma.post.findMany({
        take,
        skip,
        where: {
          userId,
        },
      })

      let postCount = await prisma.post.count({
        where: {
          userId,
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
  },
  NEXT_IRON_SESSION_CONFIG
)
