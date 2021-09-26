import { Box } from '@chakra-ui/react'
import axios, { AxiosError } from 'axios'
import React, { useEffect } from 'react'
import { QueryFunction, useQuery, UseQueryOptions } from 'react-query'
import { useRecoilState } from 'recoil'
import { authAtom } from '../state/authState'
import { User } from '../util/types'
import Navbar from './Navbar'

const getUser: QueryFunction = async () => {
  const res = await axios.get(`/api/user`)
  return res.data
}

export function useGetUser<TData = User>(
  options?: UseQueryOptions<User, AxiosError, TData>
) {
  return useQuery('user', getUser, options)
}

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
    <Box maxWidth="4xl" marginX="auto" marginTop="10">
      <Navbar />
      {children}
    </Box>
  )
}

export default Layout
