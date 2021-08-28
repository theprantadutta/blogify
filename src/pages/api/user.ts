import { withIronSession } from 'next-iron-session'
import { NEXT_IRON_SESSION_CONFIG } from '../../util/constants'

export default withIronSession(async (req, res) => {
  try {
    const user = req.session.get('user')
    return res.status(200).json(user)
  } catch (e) {
    return res.status(200).json({})
  }
}, NEXT_IRON_SESSION_CONFIG)
