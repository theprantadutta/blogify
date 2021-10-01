import { Post } from '@prisma/client'
import prisma from '../../lib/prisma'
import handler from '../../util/handler'

export default handler().get(async (req, res) => {
  const user = req.session.get('user')

  if (!user) {
    return res.status(419).json({
      error: 'You are not authenticated',
    })
  }

  let { page, id }: any = req.query

  if (!page) {
    return res.status(422).json({
      error: 'Please Provide Page Information',
    })
  }

  page = parseInt(page)
  id = parseInt(id)
  const take = 3
  let skip = (page - 1) * take

  let posts: Post[] = []

  try {
    if (Number.isNaN(id)) {
      posts = await prisma.post.findMany({
        take,
        skip,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          _count: {
            select: { comments: true },
          },
          likes: {
            select: {
              userId: true,
            },
          },
        },
      })
    } else {
      posts = await prisma.post.findMany({
        where: { userId: id },
        take,
        skip,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          _count: {
            select: { comments: true },
          },
          likes: {
            select: {
              userId: true,
            },
          },
        },
      })
    }
    let postCount = await prisma.post.count()

    return res.status(200).json({
      posts,
      totalPage:
        postCount % 3 === 0 ? postCount / 3 : Math.round(postCount / 3 + 1),
      isNextPage: postCount - (skip + take) > 0,
    })
  } catch (e) {
    return res.status(422).json({
      error: e.message,
    })
  }
})
