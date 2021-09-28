import { SessionOptions } from 'next-iron-session'

export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const API_URL = IS_PRODUCTION
  ? 'http://new-blogify.netlify.app/api'
  : 'http://localhost:3000/api'

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
    secure: IS_PRODUCTION,
    sameSite: 'strict',
    httpOnly: true,
    path: '/',
  },
}
