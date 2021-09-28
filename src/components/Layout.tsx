import { Box } from '@chakra-ui/react'
import { User } from '@prisma/client'
import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { authAtom } from '../state/authState'

interface LayoutProps {
  user: User
}

const Layout: React.FC<LayoutProps> = ({ children, user }) => {
  const [auth, setAuth] = useRecoilState(authAtom)
  useEffect(() => {
    if (user) {
      setAuth(user)
    } else {
      setAuth(null)
    }
  }, [auth, setAuth, user])
  return (
    <Box maxWidth="4xl" marginX="auto">
      {children}
    </Box>
  )
}

export default Layout
