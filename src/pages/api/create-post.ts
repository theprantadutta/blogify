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
    const { userId, title, content } = req.body
    if (!userId || !title || !content) {
      return res.status(422).json({
        error: 'Please Provide UserId, Title and Content',
      })
    }

    try {
      const post = await prisma.post.create({
        data: {
          title,
          content,
          userId,
        },
      })

      return res.status(200).json(post)
    } catch (e) {
      return res.status(422).json({
        error: e.message,
      })
    }
  },
  NEXT_IRON_SESSION_CONFIG
)
