import prisma from '../../lib/prisma'
import handler from '../../util/handler'

export default handler().post(async (req, res) => {
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
})
