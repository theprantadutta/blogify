import { User } from '@prisma/client'
import { atom } from 'recoil'

export const authAtom = atom<User | null>({
  key: 'authAtom',
  default: null,
})
