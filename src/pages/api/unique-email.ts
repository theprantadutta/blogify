import prisma from '../../lib/prisma'
import handler, { IRON_SESSION_MIDDLEWARE } from '../../util/handler'

export default handler()
  .use(IRON_SESSION_MIDDLEWARE)
  .post(async (req, res) => {
    const { email } = req.body

    if (!email) {
      return res.status(422).json({
        error: 'Please Provide an email',
      })
    }

    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!user) {
        return res.status(200).json({ OK: 'OK' })
      } else {
        return res.status(422).json({
          error: 'Something Went Wrong',
        })
      }
    } catch (e) {
      return res.status(422).json({
        error: 'Something Went Wrong',
      })
    }
  })
