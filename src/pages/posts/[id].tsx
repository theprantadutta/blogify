import { Post } from '@prisma/client'
import axios, { AxiosError } from 'axios'
import isEmpty from 'lodash/isEmpty'
import { GetServerSideProps } from 'next'
import React from 'react'
import { QueryFunction, useQuery, UseQueryOptions } from 'react-query'
import Layout from '../../components/Layout'
import LoadingButton from '../../components/LoadingButton'
import SinglePost from '../../components/SinglePost'
import { API_URL } from '../../util/constants'
import { ModifiedUser } from '../../util/types'

const getSinglePost: QueryFunction = async (key) => {
  const postId = key.queryKey[1]
  const res = await axios.get('/api/get-single-post/' + postId)
  return res.data
}

export function useGetSinglePost<TData = Post>(
  postId: string,
  options?: UseQueryOptions<Post, AxiosError, TData>
) {
  return useQuery(['all-posts', postId], getSinglePost, options)
}

interface EditPostProps {
  user: ModifiedUser | null
  postId: string
  post: Post
}

const EditPost: React.FC<EditPostProps> = ({ user, postId, post }) => {
  const { data: postData, status } = useGetSinglePost(postId, {
    initialData: post,
  })
  return (
    <Layout user={user}>
      {status === 'loading' && <LoadingButton />}

      {post && <SinglePost post={postData} />}

      {status === 'error' && <p>Post Not Found</p>}
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
