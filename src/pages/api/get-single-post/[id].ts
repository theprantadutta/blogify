import { NextApiResponse } from 'next'
import { withIronSession } from 'next-iron-session'
import prisma from '../../../lib/prisma'
import { NEXT_IRON_SESSION_CONFIG } from '../../../util/constants'
import { ExtendedApiRequest } from '../../../util/types'

export default withIronSession(
  async (req: ExtendedApiRequest, res: NextApiResponse) => {
    const user = req.session.get('user')

    if (!user) {
      return res.status(419).json({
        error: 'You are not authenticated',
      })
    }
    const id = parseInt(req.query.id as any)

    if (!id) {
      return res.status(419).json({
        error: 'Please Provide a PostID',
      })
    }

    try {
      const post = await prisma.post.findFirst({
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
  },
  NEXT_IRON_SESSION_CONFIG
)
