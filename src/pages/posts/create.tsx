import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import { GetServerSideProps } from 'next'
import React from 'react'
import Layout from '../../components/Layout'
import PostForm from '../../components/PostForm'
import { API_URL } from '../../util/constants'
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

export default NewPost
