import { Box, Heading, useToast } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Post } from '@prisma/client'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useRecoilValue } from 'recoil'
import useSWR, { useSWRConfig } from 'swr'
import * as yup from 'yup'
import { authAtom } from '../../state/authState'
import { PostsWithIsNext } from '../../util/types'
import {
  formVariants,
  fromTheLeftVariants,
  fromTheRightVariants
} from '../../util/variants'
import InputTextField from '../FormFields/InputTextField'
import PrimaryButton from '../Shared/PrimaryButton'
import ReactLoader from '../Shared/ReactLoader'

interface PostFormProps {
  post?: Post
  pageTitle: string
  buttonName: string
  operation: 'update' | 'create'
}

interface NewPostFormValues {
  title: string
  content: string
}

const PostForm: React.FC<PostFormProps> = ({
  post,
  pageTitle,
  buttonName,
  operation
}) => {
  const toast = useToast()
  const router = useRouter()
  const auth = useRecoilValue(authAtom)
  const [submitting, setSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<NewPostFormValues>({
    resolver: yupResolver(
      yup
        .object({
          title: yup.string().min(6).required(),
          content: yup.string().min(6).required()
        })
        .required()
    ),
    defaultValues: {
      title: post ? post.title : '',
      content: post ? post.content : ''
    },
    mode: 'onSubmit',
    reValidateMode: 'onBlur'
  })

  const { data }: { data?: PostsWithIsNext } = useSWR<PostsWithIsNext, any>(
    '/posts?page=1'
  )
  const { mutate } = useSWRConfig()

  const onSubmit = async (values: NewPostFormValues) => {
    console.log('Form Values: ', values)
    let upsertPostValues: Post = values as Post
    if (operation === 'update') {
      upsertPostValues = { ...upsertPostValues, id: post.id }
    }
    setSubmitting(true)

    mutate(
      '/posts?page=1',
      {
        ...data,
        posts: [...data.posts, { upsertPostValues, id: Math.random() }]
      },
      false
    )
    router.push('/posts')
    try {
      await axios.post(`/${operation}-post`, {
        ...upsertPostValues,
        userId: auth.id
      })
      toast({
        title: `Post ${operation}d successfully`,
        status: 'success',
        position: 'top-right',
        duration: 9000,
        isClosable: true
      })
    } catch (e) {
      toast({
        title: `Something Went Wrong`,
        status: 'error',
        position: 'top-right',
        duration: 9000,
        isClosable: true
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box width="xl" mx="auto" marginTop="4">
      <Heading my="5" as="h4" fontSize="xl" fontWeight="bold">
        {pageTitle}
      </Heading>

      <motion.form variants={formVariants()} onSubmit={handleSubmit(onSubmit)}>
        <motion.div variants={fromTheLeftVariants()}>
          <Box my="2">
            <Controller
              name="title"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <InputTextField
                  error={errors?.title?.message}
                  placeholder="Enter Title"
                  label="Enter Post Title"
                  field={field}
                />
              )}
            />
          </Box>
        </motion.div>

        <motion.div variants={fromTheRightVariants()}>
          <Box my="2">
            <Controller
              name="content"
              control={control}
              defaultValue={''}
              render={({ field }) => (
                <InputTextField
                  error={errors?.content?.message}
                  label="Post Content"
                  placeholder="Enter Post Content"
                  field={field}
                />
              )}
            />
          </Box>
        </motion.div>

        <PrimaryButton
          disabled={submitting}
          w="100%"
          my="5"
          type="submit"
          marginX="0"
        >
          {submitting ? <ReactLoader /> : buttonName}
        </PrimaryButton>
      </motion.form>
    </Box>
  )
}

export default PostForm
