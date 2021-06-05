import { Box } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { authAtom } from '../state/authState'
import { ModifiedUser } from '../util/types'
import Navbar from './Navbar'

interface LayoutProps {
  user: ModifiedUser
}

const Layout: React.FC<LayoutProps> = ({ children, user }) => {
  const [auth, setAuth] = useRecoilState(authAtom)
  useEffect(() => {
    if (user) {
      setAuth(user)
    } else {
      setAuth(null)
    }
  }, [auth])
  return (
    <Box width="xl" marginX="auto" marginTop="10">
      <Navbar />
      {children}
    </Box>
  )
}

export default Layout
