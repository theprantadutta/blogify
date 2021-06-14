import { NextApiRequest, NextApiResponse } from 'next'
import { Session, withIronSession } from 'next-iron-session'

export interface NextApiRequestExtended extends NextApiRequest {
  session: Session
}

export default function withSession(
  handler: (req: NextApiRequestExtended, res: NextApiResponse) => any
) {
  return withIronSession(handler, {
    cookieName: 'blogify',
    password: process.env.SECRET_COOKIE_PASSWORD,
    // if your localhost is served on http:// then disable the secure flag
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  })
}
