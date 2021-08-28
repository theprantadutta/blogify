import { NextApiRequest } from 'next'
import { Session } from 'next-iron-session'

export type ExtendedApiRequest = NextApiRequest & {
  session: Session
}

export type ModifiedUser = {
  id: number
  name: string
  email: string
}

export type NavButtonLinks = {
  title: string
  link: string
}
