// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import { withIronSession } from 'next-iron-session'
import { NEXT_IRON_SESSION_CONFIG } from '../util/constants'

export default function withSession(handler: any) {
  return withIronSession(handler, NEXT_IRON_SESSION_CONFIG)
}
