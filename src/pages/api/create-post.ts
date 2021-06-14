import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

export default async (req: NextApiRequest, res: NextApiResponse) => {
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
}
