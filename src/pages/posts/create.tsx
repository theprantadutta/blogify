import { GetServerSideProps } from 'next'
import React from 'react'
import Layout from '../../components/Layout'
import PostForm from '../../components/PostForm'
import withAuth from '../../HOCs/withAuth'
import { ModifiedUser } from '../../util/types'

interface NewPostProps {
  user: ModifiedUser | null
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
