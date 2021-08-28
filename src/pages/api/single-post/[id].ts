import { NextApiResponse } from 'next'
import nc from 'next-connect'
import prisma from '../../../lib/prisma'
import {
  API_OPTIONS,
  IRON_SESSION_MIDDLEWARE,
  NextApiExtendedRequest,
} from '../../../util/handler'

export default nc<NextApiExtendedRequest, NextApiResponse>(API_OPTIONS)
  .use(IRON_SESSION_MIDDLEWARE)
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
