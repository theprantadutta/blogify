import { Box, Heading, Text } from '@chakra-ui/react'
import { User } from '@prisma/client'
import { GetServerSideProps } from 'next'
import { withIronSession } from 'next-iron-session'
import Link from 'next/link'
import React from 'react'
import { useRecoilValue } from 'recoil'
import Layout from '../components/Layout'
import { authAtom } from '../state/authState'
import { FEATURES, NEXT_IRON_SESSION_CONFIG } from '../util/constants'

interface IndexProps {
  user: User | null
}

const Index: React.FC<IndexProps> = ({ user }) => {
  const auth = useRecoilValue(authAtom)
  return (
    <Layout user={user}>
      <Box marginY="4">
        {auth ? (
          <Heading as="h4" fontSize="lg">
            You can now see all the
            <Link passHref href="/posts">
              <Text as="span" color="purple.700" cursor="pointer">
                {' '}
                Posts
              </Text>
            </Link>
          </Heading>
        ) : (
          <Heading as="h4" fontSize="lg">
            Please{' '}
            <Link passHref href="/login">
              <Text as="span" color="purple.700" cursor="pointer">
                Log In
              </Text>
            </Link>{' '}
            to view Posts
          </Heading>
        )}
      </Box>
      <Text fontWeight="semibold" fontSize="xl">
        Project Features
      </Text>

      {FEATURES.map((feature) => (
        <Box key={feature} my="2">
          <Text fontWeight="semibold" color="purple.500">
            ✅ {feature}
          </Text>
        </Box>
      ))}
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = withIronSession(
  async ({ req }) => {
    const user = req.session.get('user')
    if (!user) {
      return { props: {} }
    }
    return {
      props: { user },
    }
  },
  NEXT_IRON_SESSION_CONFIG
)

export default Index
