import { User } from '@prisma/client'
import { GetServerSideProps } from 'next'
import React from 'react'
import AllPosts, { PostsWithIsNext } from '../../components/AllPosts'
import Layout from '../../components/Layout'
import withAuth from '../../HOCs/withAuth'

interface indexProps {
  user: User | null
  data: PostsWithIsNext
}

const index: React.FC<indexProps> = ({ user, data }) => {
  return (
    <Layout user={user}>
      <AllPosts initialData={data} />
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
