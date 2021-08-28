import { GetServerSideProps } from 'next'
import React from 'react'
import Layout from '../../../components/Layout'
import LoadingButton from '../../../components/LoadingButton'
import PostForm from '../../../components/PostForm'
import withAuth from '../../../HOCs/withAuth'
import { ModifiedUser } from '../../../util/types'
import { useGetSinglePost } from '../[id]'

interface EditPostProps {
  user: ModifiedUser | null
  postId: string
}

const EditPost: React.FC<EditPostProps> = ({ user, postId }) => {
  const { data: postData, status } = useGetSinglePost(postId)
  return (
    <Layout user={user}>
      {status === 'loading' && <LoadingButton />}

      {status === 'error' && <p>Post Not Found</p>}

      {postData && (
        <PostForm
          operation="update"
          pageTitle={`Update Post`}
          buttonName="Update Post"
          post={postData}
        />
      )}
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
