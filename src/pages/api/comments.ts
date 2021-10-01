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

    let { postId }: any = req.query

    postId = parseInt(postId)

    try {
      const comments = await prisma.comment.findMany({
        where: {
          postId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      })

      return res.status(200).json(comments)
    } catch (e) {
      return res.status(422).json({
        error: e.message,
      })
    }
  })
  .post(async (req, res) => {
    const user = req.session.get('user')

    if (!user) {
      return res.status(419).json({
        error: 'You are not authenticated',
      })
    }

    let { userId, postId, content }: any = req.body

    if (!postId || !userId || !content) {
      return res.status(422).json({
        error: 'Please Provide content, postId and userId value',
      })
    }

    postId = parseInt(postId)
    userId = parseInt(userId)

    try {
      await prisma.comment.create({
        data: {
          userId,
          postId,
          content,
        },
      })

      return res.status(200).json({ OK: 'OK' })
    } catch (e) {
      return res.status(422).json({
        error: e.message,
      })
    }
  })
