import { User } from '@prisma/client'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import { GetServerSideProps } from 'next'
import React from 'react'
import AllPosts, { PostsWithIsNext } from '../../components/AllPosts'
import Layout from '../../components/Layout'
import { API_URL } from '../../util/constants'

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

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    let { data: user } = await axios.get(API_URL + '/user')
    if (!isEmpty(user)) {
      return { props: { user } }
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

export default index
