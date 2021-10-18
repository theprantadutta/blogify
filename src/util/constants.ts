import { SessionOptions } from 'next-iron-session'

export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
// export const API_URL = IS_PRODUCTION
//   ? 'http://new-blogify.netlify.app/api'
//   : 'http://localhost:3000/api'

export const API_URL = 'http://localhost:3000/api'

export const FEATURES = [
  'User Authentication',
  'Post CRUD with Prisma',
  'Optimistic Updates and Caching with React Query',
  'Popup and Modal with chakra ui',
  'Update Profile and Change Password',
]

export const NEXT_IRON_SESSION_CONFIG: SessionOptions = {
  cookieName: 'blogify',
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieOptions: {
    maxAge: 1 * 60 * 60 * 24,
    secure: IS_PRODUCTION,
    sameSite: 'strict',
    httpOnly: true,
    path: '/',
  },
}
