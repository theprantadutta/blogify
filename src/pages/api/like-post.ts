import prisma from '../../lib/prisma'
import handler, { IRON_SESSION_MIDDLEWARE } from '../../util/handler'

export default handler()
  .use(IRON_SESSION_MIDDLEWARE)
  .get(async (req, res) => {
    const user = req.session.get('user')

    if (!user) {
      return res.status(419).json({
        error: 'You are not authenticated',
      })
    }

    let { postId, userId }: any = req.query

    if (!postId || !userId) {
      return res.status(422).json({
        error: 'Please Provide postId and userId value',
      })
    }

    postId = parseInt(postId)
    userId = parseInt(userId)

    try {
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      })

      return res.status(200).json({ OK: 'OK' })
    } catch (e) {
      return res.status(422).json({
        error: e.message,
      })
    }
  })
