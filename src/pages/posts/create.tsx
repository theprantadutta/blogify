import { User } from '@prisma/client'
import { GetServerSideProps } from 'next'
import React from 'react'
import Layout from '../../components/Layout'
import PostForm from '../../components/PostForm'
import withAuth from '../../HOCs/withAuth'

interface NewPostProps {
  user: User | null
}

const NewPost: React.FC<NewPostProps> = ({ user }) => {
  return (
    <Layout user={user}>
      <PostForm
        operation="create"
        buttonName="Create Post"
        pageTitle="Create A New Post"
      />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    const { user } = context
    return { props: { user } }
  }
)

export default NewPost
