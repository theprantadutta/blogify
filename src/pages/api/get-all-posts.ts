import { NextApiResponse } from 'next'
import nc from 'next-connect'
import prisma from '../../lib/prisma'
import {
  API_OPTIONS,
  IRON_SESSION_MIDDLEWARE,
  NextApiExtendedRequest,
} from '../../util/handler'

export default nc<NextApiExtendedRequest, NextApiResponse>(API_OPTIONS)
  .use(IRON_SESSION_MIDDLEWARE)
  .post(async (req, res) => {
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

      return res
        .status(200)
        .json({ posts, isNextPage: postCount - (skip + take) > 0 })
    } catch (e) {
      return res.status(422).json({
        error: 'Something Went Wrong',
      })
    }
  })
