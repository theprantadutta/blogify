import { Box } from '@chakra-ui/react'
import axios, { AxiosError } from 'axios'
import React, { useEffect } from 'react'
import { QueryFunction, useQuery, UseQueryOptions } from 'react-query'
import { useSetRecoilState } from 'recoil'
import { authAtom } from '../state/authState'
import { ModifiedUser } from '../util/types'
import Navbar from './Navbar'

const getUser: QueryFunction = async () => {
  const res = await axios.get(`/api/user`)
  return res.data
}

export function useGetUser<TData = ModifiedUser>(
  options?: UseQueryOptions<ModifiedUser, AxiosError, TData>
) {
  return useQuery('user', getUser, options)
}

interface LayoutProps {
  user: ModifiedUser
}

const Layout: React.FC<LayoutProps> = ({ children, user }) => {
  const setAuth = useSetRecoilState(authAtom)
  useEffect(() => {
    if (user) {
      setAuth(user)
    } else {
      setAuth(null)
    }
  }, [])
  return (
    <Box width="xl" marginX="auto" marginTop="10">
      <Navbar />
      {children}
    </Box>
  )
}

export default Layout
