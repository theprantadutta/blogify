import { NextApiResponse } from 'next'
import nc from 'next-connect'
import {
  API_OPTIONS,
  IRON_SESSION_MIDDLEWARE,
  NextApiExtendedRequest,
} from '../../util/handler'

export default nc<NextApiExtendedRequest, NextApiResponse>(API_OPTIONS)
  .use(IRON_SESSION_MIDDLEWARE)
  .post(async (req, res) => {
    req.session.destroy()
    return res.status(200).json({ ok: 'OK' })
  })
