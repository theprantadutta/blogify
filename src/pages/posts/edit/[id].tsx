import { Post } from '@prisma/client'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import { GetServerSideProps } from 'next'
import React from 'react'
import Layout from '../../../components/Layout'
import PostForm from '../../../components/PostForm'
import { API_URL } from '../../../util/constants'
import { ModifiedUser } from '../../../util/types'

interface EditPostProps {
  user: ModifiedUser | null
  post: Post
}

const EditPost: React.FC<EditPostProps> = ({ user, post }) => {
  return (
    <Layout user={user}>
      {!post && <p>Post Not Found</p>}

      {post && (
        <PostForm
          operation="update"
          pageTitle={`Update Post`}
          buttonName="Update Post"
          post={post}
        />
      )}
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    let { data: user } = await axios.get(API_URL + '/user')

    const postId = query.id

    const { data } = await axios.get(API_URL + '/get-single-post/' + postId)

    if (!isEmpty(user)) {
      return { props: { user, postId, post: data } }
    }
  } catch (e) {
    console.log('user not authenticated', e.message)
  }

  return {
    redirect: {
      permanent: false,
      destination: '/login',
    },
    props: {},
  }
}

export default EditPost
