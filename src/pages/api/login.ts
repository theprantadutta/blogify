import { compareSync } from 'bcrypt'
import { withIronSession } from 'next-iron-session'
import prisma from '../../lib/prisma'
import { NEXT_IRON_SESSION_CONFIG } from '../../util/constants'

export default withIronSession(async (req, res) => {
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

      // setting cookies with next-iron-session
      req.session.set('user', user)
      await req.session.save()

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
}, NEXT_IRON_SESSION_CONFIG)
