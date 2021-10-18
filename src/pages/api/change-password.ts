import { compareSync, hashSync } from 'bcrypt'
import prisma from '../../lib/prisma'
import handler from '../../util/handler'

export default handler().post(async (req, res) => {
  const { id, password, confirmPassword } = req.body

  if (!id || !password || !confirmPassword) {
    return res.status(422).json({
      error: 'Please Provide passwords',
    })
  }

  const user = await prisma.user.findUnique({ where: { id } })

  if (!compareSync(password, user.password)) {
    return res.status(422).json({
      error: 'Current Password is incorrect',
    })
  }

  let hashPassword = hashSync(password, 10)

  try {
    await prisma.user.update({
      data: {
        password: hashPassword,
      },
      where: { id },
    })

    return res.status(200).json({ ok: 'OK' })
  } catch (e) {
    return res.status(422).json({
      error: e.message,
    })
  } finally {
    return res.end()
  }
})
