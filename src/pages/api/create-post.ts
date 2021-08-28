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
