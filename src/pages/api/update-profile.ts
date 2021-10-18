import { User } from '@prisma/client'
import prisma from '../../lib/prisma'
import handler, { IRON_SESSION_MIDDLEWARE } from '../../util/handler'

export default handler()
  .use(IRON_SESSION_MIDDLEWARE)
  .post(async (req, res) => {
    const { id, email, dateOfBirth, gender, mobileNo, name }: User = req.body

    if (!id || !email || !dateOfBirth || !gender || !mobileNo || !name) {
      return res.status(422).json({
        error: 'Please Provide profile data',
      })
    }

    try {
      const user = await prisma.user.update({
        data: {
          name,
          email,
          dateOfBirth,
          gender,
          mobileNo,
        },
        where: { id },
      })

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
