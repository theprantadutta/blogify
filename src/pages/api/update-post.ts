import prisma from '../../lib/prisma'
import handler, { IRON_SESSION_MIDDLEWARE } from '../../util/handler'

export default handler()
  .use(IRON_SESSION_MIDDLEWARE)
  .post(async (req, res) => {
    const user = req.session.get('user')

    if (!user) {
      return res.status(419).json({
        error: 'You are not authenticated',
      })
    }
    const { id, userId, title, content } = req.body
    if (!id || !userId || !title || !content) {
      return res.status(422).json({
        error: 'Please Provide id, UserId, Title and Content',
      })
    }

    try {
      const post = await prisma.post.update({
        where: {
          id,
        },
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
  })
