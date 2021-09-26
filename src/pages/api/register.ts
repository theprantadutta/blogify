import { hashSync } from 'bcrypt'
import prisma from '../../lib/prisma'
import handler from '../../util/handler'

export default handler().post(async (req, res) => {
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
