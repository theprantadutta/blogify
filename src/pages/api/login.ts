import { compareSync } from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import redis, { REDIS_LOGIN_KEY, TTL } from '../../util/redis'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(422).json({
      error: 'Please Provide email and password',
    })
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (!user) {
      return res.status(422).json({
        error: 'Invalid Email',
      })
    }

    if (compareSync(password, user.password)) {
      delete user.password
      await redis.set(REDIS_LOGIN_KEY, user.id, 'EX', TTL)
      return res.status(200).json(user)
    }

    return res.status(422).json({
      error: "Password Didn't match",
    })
  } catch (e) {
    return res.status(422).json({
      error: e.message,
    })
  }
}
