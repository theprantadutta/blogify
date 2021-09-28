import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spacer,
  Text,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { Post } from '@prisma/client'
import axios, { AxiosError } from 'axios'
import { motion } from 'framer-motion'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import React, { useState } from 'react'
import {
  QueryFunction,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions
} from 'react-query'
import { useRecoilValue } from 'recoil'
import { authAtom } from '../state/authState'
import PrimaryButton from './PrimaryButton'
import { FullWidthReactLoader } from './ReactLoader'

export interface PostsWithIsNext {
  posts: Post[]
  isNextPage: boolean
  totalPage: number
}

const getPosts: QueryFunction = async (key) => {
  const postMode = key.queryKey[1]
  const page = key.queryKey[2]
  const res = await axios.post(`/api/get-${postMode}-posts`, { page })
  return res.data
}

function useGetAllPosts<TData = PostsWithIsNext>(
  postMode: string,
  page: number,
  options?: UseQueryOptions<PostsWithIsNext, AxiosError, TData>
) {
  return useQuery(['all-posts', postMode, page], getPosts, options)
}

interface AllPostsProps {
  initialData: PostsWithIsNext
}

const AllPosts: React.FC<AllPostsProps> = ({ initialData }) => {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const queryClient = useQueryClient()
  const router = useRouter()
  const auth = useRecoilValue(authAtom)
  const [postMode, setPostMode] = useState<'all' | 'my'>('all')
  const [page, setPage] = useState(1)

  const { data, isLoading, status } = useGetAllPosts(postMode, page, {
    initialData,
  })

  const deletePostMutation = useMutation(
    (id: number) => axios.delete('/api/single-post/' + id),
    {
      onSuccess: () => {
        toast({
          title: `Post deleted successfully`,
          status: 'success',
          position: 'top-right',
          duration: 9000,
          isClosable: true,
        })
      },
      onMutate: async (id: number) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(['all-posts', postMode, page])

        // Snapshot the previous value
        const posts = queryClient
          .getQueryData<PostsWithIsNext>(['all-posts', postMode, page])
          .posts.filter((post) => post.id !== id)

        // Optimistically update to the new value
        queryClient.setQueryData<PostsWithIsNext>(
          ['all-posts', postMode, page],
          { posts, isNextPage: data.isNextPage, totalPage: data.totalPage }
        )

        return { posts, isNextPage: data.isNextPage }
      },

      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (_err, _variables, context) => {
        if ('posts' in context && 'isNextPage' in context) {
          queryClient.setQueryData<PostsWithIsNext>(
            ['all-posts', postMode, page],
            {
              posts: context?.posts,
              isNextPage: data?.isNextPage,
              totalPage: data.totalPage,
            }
          )
        }
      },

      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(['all-posts', postMode, page])
      },
    }
  )

  // to delete the post, as we are using modal,
  // we need another state to control deletable id
  const [postId, setPostId] = useState(0)

  return (
    <Box my="5">
      <Flex alignItems="center">
        <Select
          w="50%"
          my="5"
          fontWeight="semibold"
          defaultValue="all"
          onChange={(e) => setPostMode(e.target.value as 'all' | 'my')}
        >
          <option value="all">All Posts</option>
          <option value="my">Posts By Me</option>
        </Select>
        <Spacer />
        <PrimaryButton>
          <Link href="/posts/create">Create Post</Link>
        </PrimaryButton>
      </Flex>

      <Heading as="h4">Showing {postMode} posts</Heading>
      {isLoading && <FullWidthReactLoader />}
      {data?.posts &&
        data?.posts.map((post, i) => {
          return (
            <motion.div
              initial={{ x: i % 2 === 0 ? '-100vw' : '100vw' }}
              animate={{ x: 0 }}
              transition={{ delay: 0.5 * i, duration: 0.8, stiffness: 120 }}
              key={post.id}
            >
              <Box my="2" overflow="hidden">
                <Flex alignItems="center">
                  <Link passHref href={`/posts/${post.id}`}>
                    <Text
                      color="purple.700"
                      cursor="pointer"
                      as="p"
                      fontSize="xl"
                      fontWeight="semibold"
                      my="2"
                    >
                      {post.title}
                    </Text>
                  </Link>
                  <Spacer />
                  {post.userId === auth?.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1, duration: 1 }}
                    >
                      <IconButton
                        m="2"
                        variant="outline"
                        colorScheme="purple"
                        aria-label="Call Sage"
                        fontSize="20px"
                        icon={<EditIcon />}
                        onClick={() => router.push(`/posts/edit/${post.id}`)}
                      />
                      <IconButton
                        mr={2}
                        variant="outline"
                        colorScheme="red"
                        aria-label="Call Sage"
                        fontSize="20px"
                        icon={<DeleteIcon />}
                        onClick={() => {
                          setPostId(post.id)
                          onOpen()
                        }}
                      />
                    </motion.div>
                  )}
                </Flex>
                <Text isTruncated as="p" my="2">
                  {post.content}
                </Text>
              </Box>
            </motion.div>
          )
        })}

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="2xl" fontWeight="bold">
            Delete A Post
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody fontSize="xl" fontWeight="bold" pb={6}>
            You are Deleting a Post. Are You Sure?
          </ModalBody>

          <ModalFooter>
            <PrimaryButton
              onClick={() => {
                deletePostMutation.mutate(postId)
                onClose()
              }}
              mr={3}
            >
              Go Ahead
            </PrimaryButton>
            <PrimaryButton onClick={onClose}>Not Sure</PrimaryButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {data?.posts.length === 0 && (
        <Box my="2">
          <Text as="p" fontSize="xl" fontWeight="semibold" my="5">
            No Posts Yet
          </Text>
        </Box>
      )}

      {status === 'success' && (
        <Flex justify="space-between" alignItems="center">
          <motion.div
            initial={{ x: '-100vw' }}
            animate={{ x: 0 }}
            transition={{ delay: 1, duration: 2 }}
          >
            <PrimaryButton
              disabled={page === 1}
              onClick={() => setPage(Math.max(page - 1, 1))}
            >
              Previous Page
            </PrimaryButton>
          </motion.div>
          <motion.div
            initial={{ y: '100vh' }}
            animate={{ y: 0 }}
            transition={{ delay: 1, duration: 2 }}
          >
            <Heading fontSize="lg" fontWeight="bold">
              Showing Page {page} of {data.totalPage}
            </Heading>
          </motion.div>
          <motion.div
            initial={{ x: '100vw' }}
            animate={{ x: 0 }}
            transition={{ delay: 1, duration: 2 }}
          >
            <PrimaryButton
              disabled={!data?.isNextPage}
              onClick={() => setPage(page + 1)}
            >
              Next Page
            </PrimaryButton>
          </motion.div>
        </Flex>
      )}
    </Box>
  )
}

export default AllPosts
