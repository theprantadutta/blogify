import { Post, User } from '@prisma/client'
import axios, { AxiosError } from 'axios'
import { GetServerSideProps } from 'next'
import React from 'react'
import { QueryFunction, useQuery, UseQueryOptions } from 'react-query'
import Layout from '../../components/Layout'
import { FullWidthReactLoader } from '../../components/ReactLoader'
import SinglePost from '../../components/SinglePost'
import withAuth from '../../HOCs/withAuth'

const getSinglePost: QueryFunction = async (key) => {
  const postId = key.queryKey[1]
  const res = await axios.get('/api/single-post/' + postId)
  return res.data
}

export function useGetSinglePost<TData = Post>(
  postId: string,
  options?: UseQueryOptions<Post, AxiosError, TData>
) {
  return useQuery(['all-posts', postId], getSinglePost, options)
}

interface EditPostProps {
  user: User | null
  postId: string
}

const EditPost: React.FC<EditPostProps> = ({ user, postId }) => {
  const { data: postData, status } = useGetSinglePost(postId)
  return (
    <Layout user={user}>
      {status === 'loading' && <FullWidthReactLoader />}

      {postData && <SinglePost post={postData} />}

      {status === 'error' && <p>Post Not Found</p>}
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
