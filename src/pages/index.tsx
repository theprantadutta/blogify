import { Box, Heading, Text } from '@chakra-ui/react'
import { NextPageContext } from 'next'
import { withIronSession } from 'next-iron-session'
import Link from 'next/link'
import React from 'react'
import { useRecoilValue } from 'recoil'
import Layout from '../components/Layout'
import { cookieOptions } from '../handler'
import { authAtom } from '../state/authState'
import { ModifiedUser } from '../util/types'

interface indexProps {
  user: ModifiedUser
}

const index: React.FC<indexProps> = ({user}) => {
  const auth = useRecoilValue(authAtom)
  console.log(auth)
  return (
    <Layout user={user}>
      <Box margin="4">
        {auth ? (
          <p>Show Posts Here</p>
        ) : (
          <Heading as="h4" fontSize="lg">
            Please{' '}
            <Link href="/login">
              <Text as="span" color="purple.700">
                Log In
              </Text>
            </Link>{' '}
            to view Posts
          </Heading>
        )}
      </Box>
    </Layout>
  )
}

export const getServerSideProps = withIronSession(
  async ({ req }: NextPageContext) => {
    const user = (req as any).session.get('user')
    if (!user) {
      return { props: {} }
    }
    return {
      props: { user },
    }
  },
  cookieOptions
)
export default index
