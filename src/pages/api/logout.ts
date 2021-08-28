import { withIronSession } from 'next-iron-session'
import { NEXT_IRON_SESSION_CONFIG } from '../../util/constants'

export default withIronSession((req, res) => {
  req.session.destroy()
  return res.status(200).end()
}, NEXT_IRON_SESSION_CONFIG)
