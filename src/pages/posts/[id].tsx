import { User } from '@prisma/client'
import { GetServerSideProps } from 'next'
import React from 'react'
import useSWR from 'swr'
import Layout from '../../components/Layout'
import { FullWidthReactLoader } from '../../components/ReactLoader'
import SinglePost from '../../components/SinglePost'
import withAuth from '../../HOCs/withAuth'

interface EditPostProps {
  user: User | null
  postId: string
}

const EditPost: React.FC<EditPostProps> = ({ user, postId }) => {
  const { data: postData, error } = useSWR('/single-post/' + postId)
  return (
    <Layout user={user}>
      {!postData && !error && <FullWidthReactLoader />}

      {postData && <SinglePost post={postData} />}

      {error && <p>Post Not Found</p>}
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    const { user } = context
    const postId = context.query.id

    return { props: { user, postId } }
  }
)

export default EditPost
