import { atom } from 'recoil'
import { ModifiedUser } from '../util/types'

export const authAtom = atom<ModifiedUser | null>({
  key: 'authAtom',
  default: null,
})
