import { User } from '@prisma/client'
import { GetServerSideProps } from 'next'
import React from 'react'
import Layout from '../../components/Layouts/Layout'
import AllPosts from '../../components/Posts/AllPosts'
import withAuth from '../../HOCs/withAuth'

interface indexProps {
  user: User | null
}

const index: React.FC<indexProps> = ({ user }) => {
  return (
    <Layout user={user}>
      <AllPosts />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    const { user } = context
    return { props: { user } }
  }
)

export default index
