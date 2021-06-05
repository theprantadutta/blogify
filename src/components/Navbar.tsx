import { Box, Flex, Heading, Spacer } from '@chakra-ui/react'
import axios from 'axios'
import Link from 'next/link'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { authAtom } from '../state/authState'
import PrimaryButton from './PrimaryButton'

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const auth = useRecoilValue(authAtom)
  return (
    <Flex alignItems="center">
      <Box>
        <Heading size="md" as="h1">
          Blogify
        </Heading>
      </Box>
      <Spacer />
      <Box m="4">
        <PrimaryButton>
          <Link href="/">Home</Link>
        </PrimaryButton>
        {auth ? (
          <>
            <PrimaryButton>Welcome, {auth.name}</PrimaryButton>
            <PrimaryButton
              onClick={async () => {
                await axios.post('/api/logout')
              }}
            >
              Logout
            </PrimaryButton>
          </>
        ) : (
          <>
            <PrimaryButton>
              <Link href="/login">Login</Link>
            </PrimaryButton>
            <PrimaryButton>
              <Link href="/register">Register</Link>
            </PrimaryButton>
          </>
        )}
      </Box>
    </Flex>
  )
}

export default Navbar
