import { SessionOptions } from 'next-iron-session'

export const API_URL = 'http://localhost:3000/api'
export const IS_PRODUCTION = process.env.NODE_ENV

export const FEATURES = [
  'User Authentication',
  'Post CRUD with Prisma',
  'Optimistic Updates and Caching with React Query',
  'Popup and Modal with chakra ui',
]

export const NEXT_IRON_SESSION_CONFIG: SessionOptions = {
  cookieName: 'blogify',
  password: process.env.SECRET_COOKIE_PASSWORD,
  // if your localhost is served on http:// then disable the secure flag
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}
