import { atom } from 'recoil'
import { User } from '../util/types'

export const authAtom = atom<User | null>({
  key: 'authAtom',
  default: null,
})
