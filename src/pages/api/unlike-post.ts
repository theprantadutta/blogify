import prisma from '../../lib/prisma'
import handler, { IRON_SESSION_MIDDLEWARE } from '../../util/handler'

export default handler()
  .use(IRON_SESSION_MIDDLEWARE)
  .get(async (req, res) => {
    const user = req.session.get('user')

    if (!user) {
      return res.status(419).json({
        error: 'You are not authenticated',
      })
    }

    let { id }: any = req.query

    if (!id) {
      return res.status(422).json({
        error: 'Please Provide id value',
      })
    }

    id = parseInt(id)

    try {
      await prisma.like.delete({
        where: { id },
      })

      return res.status(200).json({ OK: 'OK' })
    } catch (e) {
      return res.status(422).json({
        error: 'Something Went Wrong',
      })
    }
  })
