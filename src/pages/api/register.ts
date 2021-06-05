import { hashSync } from 'bcrypt'
import handler from '../../handler'
import prisma from '../../lib/prisma'

export default handler.post(async (req, res) => {
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
    req.session.set('user', user)
    await req.session.save()
    return res.status(201).json(user)
  } catch (e) {
    return res.status(422).json({
      error: e.message,
    })
  }
})
