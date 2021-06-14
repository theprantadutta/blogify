import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Textarea,
  useToast,
} from '@chakra-ui/react'
import { Post } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/dist/client/router'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useRecoilValue } from 'recoil'
import { authAtom } from '../state/authState'
import LoadingButton from './LoadingButton'
import PrimaryButton from './PrimaryButton'

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
  operation,
}) => {
  const toast = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()

  const auth = useRecoilValue(authAtom)

  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [newPostValues, setNewPostValues] = useState<NewPostFormValues>({
    title: '',
    content: '',
  })

  useEffect(() => {
    if (post) {
      setNewPostValues({
        title: post.title,
        content: post.content,
      })
    }
  }, [post])

  const addPostMutation = useMutation(
    (newPost) =>
      axios.post(`/api/${operation}-post`, {
        ...newPost,
        userId: auth.id,
      }),
    {
      onSuccess: () => {
        toast({
          title: `Post ${operation}d successfully`,
          status: 'success',
          position: 'top-right',
          duration: 9000,
          isClosable: true,
        })
      }, // When mutate is called:
      onMutate: async (post: Post) => {
        console.log(`post`, post)
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries('all-posts')

        // Snapshot the previous value
        const previousPosts = queryClient.getQueryData<Post[]>([
          'all-posts',
          'all',
        ])

        // Optimistically update to the new value
        if (previousPosts) {
          queryClient.setQueryData<Post[]>(
            ['all-posts', 'all'],
            [...previousPosts, post]
          )
        }

        return { previousPosts }
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (err, variables, context) => {
        toast({
          title: `Something Went Wrong, Please Try Again`,
          status: 'error',
          position: 'top-right',
          duration: 9000,
          isClosable: true,
        })
        if (context?.previousPosts) {
          queryClient.setQueryData<Post[]>(
            ['all-posts', 'all'],
            context.previousPosts
          )
        }

        setSubmitting(false)
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(['all-posts', 'all'])
      },
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form Values: ', newPostValues)
    let upsertPostValues: Post = newPostValues as Post
    if (operation === 'update') {
      upsertPostValues = { ...upsertPostValues, id: post.id }
    }
    setSubmitting(true)
    addPostMutation.mutate(upsertPostValues)
    setError(null)
    setSubmitting(false)
    return router.push('/posts')
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNewPostValues({ ...newPostValues, [e.target.name]: e.target.value })
  }
  return (
    <Box>
      <Heading my="5" as="h4" fontSize="xl" fontWeight="bold">
        {pageTitle}
      </Heading>

      <form onSubmit={handleSubmit}>
        <FormControl my="5" id="email">
          <FormLabel>Post Title</FormLabel>
          <Input
            defaultValue={newPostValues.title}
            onChange={handleChange}
            placeholder="Enter Post Title"
            fontWeight="semibold"
            fontSize="md"
            name="title"
          />
          <FormHelperText
            fontWeight="semibold"
            color="red.500"
            fontStyle="italic"
          >
            {error}
          </FormHelperText>
        </FormControl>

        <FormControl my="5" id="password">
          <FormLabel>Post Content</FormLabel>
          <Textarea
            onChange={handleChange}
            defaultValue={newPostValues.content}
            placeholder="Enter Post Content"
            fontWeight="semibold"
            fontSize="md"
            name="content"
          />
        </FormControl>

        {submitting ? (
          <LoadingButton loadingText="Submitting" />
        ) : (
          <PrimaryButton w="100%" my="5" type="submit" marginX="0">
            {buttonName}
          </PrimaryButton>
        )}
        {/* 
        <PrimaryButton w="100%" my="5" type="submit" marginX="0">
          {buttonName}
        </PrimaryButton> */}
      </form>
    </Box>
  )
}

export default PostForm
