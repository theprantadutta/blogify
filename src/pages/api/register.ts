import { hashSync } from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import redis, { REDIS_LOGIN_KEY } from '../../util/redis'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(422).json({
      error: 'Please Provide name, email and password',
    })
  }

  let hashPassword = hashSync(password, 10)

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    })

    delete user.password
    delete user.password
    await redis.set(REDIS_LOGIN_KEY, user.id)
    return res.status(200).json(user)
  } catch (e) {
    return res.status(422).json({
      error: e.message,
    })
  }
}
