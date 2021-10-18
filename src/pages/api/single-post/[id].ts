import prisma from '../../../lib/prisma'
import handler from '../../../util/handler'

export default handler()
  .get(async (req, res) => {
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
        include: {
          // comments: true,
          likes: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      })
      return res.status(200).json(post)
    } catch (e) {
      return res.status(422).json({
        error: 'Something Went Wrong',
      })
    }
  })
  .delete(async (req, res) => {
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
  })
