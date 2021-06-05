import { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'
import { ironSession, Session } from 'next-iron-session'

export const cookieOptions = {
  cookieName: 'blogify',
  password: process.env.SECRET_COOKIE_PASSWORD,
  // if your localhost is served on http:// then disable the secure flag
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}

interface NextApiRequestExtended extends NextApiRequest {
  session: Session
}

const handler = nextConnect<NextApiRequestExtended, NextApiResponse>({
  onError(error, _req, res) {
    res
      .status(501)
      .json({ error: `Sorry Something Happened! ${error.message}` })
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `${req.method} Method is Not Allowed` })
  },
})

handler.use(ironSession(cookieOptions))

export default handler
