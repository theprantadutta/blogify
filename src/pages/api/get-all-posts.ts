import prisma from '../../lib/prisma'
import handler from '../../util/handler'

export default handler().post(async (req, res) => {
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

    return res.status(200).json({
      posts,
      totalPage:
        postCount % 3 === 0 ? postCount / 3 : Math.round(postCount / 3 + 1),
      isNextPage: postCount - (skip + take) > 0,
    })
  } catch (e) {
    return res.status(422).json({
      error: 'Something Went Wrong',
    })
  }
})
