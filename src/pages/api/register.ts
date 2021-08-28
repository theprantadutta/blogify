import { hashSync } from 'bcrypt'
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

      // setting cookies with next-iron-session
      req.session.set('user', user)
      await req.session.save()

      return res.status(200).json(user)
    } catch (e) {
      return res.status(422).json({
        error: e.message,
      })
    }
  })
