import { Box, Heading } from '@chakra-ui/react'
import { User } from '@prisma/client'
import type { GetServerSideProps, NextPage } from 'next'
import { withIronSession } from 'next-iron-session'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import Layout from '../components/Layouts/Layout'
import PrimaryButton from '../components/Shared/PrimaryButton'
import { NEXT_IRON_SESSION_CONFIG } from '../util/constants'

interface OfflineProps {
  children?: ReactNode
  user: User | null
}

const Offline: NextPage<OfflineProps> = ({ user }) => {
  const router = useRouter()
  return (
    <Layout user={user}>
      <Box marginTop={`10`}>
        <Heading as="h4" fontWeight={'semibold'} fontSize={'2xl'}>
          You are not connected to the internet
        </Heading>
        <PrimaryButton my={'5'} onClick={() => router.back()}>
          Refresh
        </PrimaryButton>
      </Box>
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

export default Offline
