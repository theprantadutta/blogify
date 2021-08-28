import { NextApiRequest, NextApiResponse } from 'next'
import nc, { Options } from 'next-connect'
import { ironSession, Session } from 'next-iron-session'
import { NEXT_IRON_SESSION_CONFIG } from './constants'

export interface NextApiExtendedRequest extends NextApiRequest {
  session: Session
}

export const IRON_SESSION_MIDDLEWARE = nc().use(
  ironSession(NEXT_IRON_SESSION_CONFIG)
)

export const API_OPTIONS: Options<NextApiExtendedRequest, NextApiResponse> = {
  onError(_error, _req, res) {
    res.status(501).json({ error: 'Sorry something happened!!' })
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  },
}
