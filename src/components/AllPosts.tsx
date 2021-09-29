import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import {
  Box,
  Center,
  Divider,
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
  useToast,
} from '@chakra-ui/react'
import { Comment, Like, Post } from '@prisma/client'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import React, { useState } from 'react'
import { AiFillLike, AiOutlineLike } from 'react-icons/ai'
import { useRecoilValue } from 'recoil'
import useSWR, { useSWRConfig } from 'swr'
import { authAtom } from '../state/authState'
import PrimaryButton from './PrimaryButton'
import { FullWidthReactLoader } from './ReactLoader'

interface ExtendedPost extends Post {
  comments: Comment[]
  likes: Like[]
}

export interface PostsWithIsNext {
  posts: ExtendedPost[]
  isNextPage: boolean
  totalPage: number
}

interface AllPostsProps {
  initialData: PostsWithIsNext
}

const AllPosts: React.FC<AllPostsProps> = ({ initialData }) => {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()
  const auth = useRecoilValue(authAtom)
  const [postMode, setPostMode] = useState<'all' | 'my'>('all')
  const [page, setPage] = useState(1)

  const url =
    postMode === 'all'
      ? `/posts?page=${page}`
      : `/posts?page=${page}&id=${auth.id}`

  const { data }: { data?: PostsWithIsNext } = useSWR(url, {
    fallbackData: initialData,
    refreshInterval: 1000 * 60 * 5,
  })

  const { mutate } = useSWRConfig()

  // to delete the post, as we are using modal,
  // we need another state to control deletable id
  const [postId, setPostId] = useState(0)

  return (
    <Box marginTop="2">
      <Flex alignItems="center">
        <Select
          w="50%"
          my="2"
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
      {!data && <FullWidthReactLoader />}
      {data?.posts &&
        data?.posts.map((post, i) => {
          return (
            <motion.div
              initial={{ x: i % 2 === 0 ? '-100vw' : '100vw' }}
              animate={{ x: 0 }}
              transition={{ delay: 0.5 * i, duration: 0.8, stiffness: 120 }}
              key={post.id}
            >
              <Box overflow="hidden">
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
                <Flex justify="start" alignItems="center">
                  <IconButton
                    bg="transparent"
                    _hover={{ bg: 'transparent' }}
                    _focus={{ bg: 'transparent' }}
                    _active={{ bg: 'transparent' }}
                    aria-label="Like Button"
                    icon={
                      i === 1 ? (
                        <AiOutlineLike style={{ color: 'purple' }} />
                      ) : (
                        <AiFillLike style={{ color: 'purple' }} />
                      )
                    }
                  />
                  <Text as="p">{post.likes?.length ?? 0} Likes</Text>
                  <Center height="10px">
                    <Divider orientation="vertical" />
                  </Center>
                  <Text as="p" marginLeft="5">
                    {post.comments?.length ?? 0} Comments
                  </Text>
                </Flex>
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
              onClick={async () => {
                // update the local data immediately, but disable the revalidation
                const newPosts = data.posts.filter((post) => {
                  return post.id !== postId
                })
                mutate(url, { ...data, posts: newPosts }, false)
                onClose()
                try {
                  // send a request to the API to update the source
                  await axios.delete('/single-post/' + postId)
                  toast({
                    title: `Post deleted successfully`,
                    status: 'success',
                    position: 'top-right',
                    duration: 9000,
                    isClosable: true,
                  })
                } catch (e) {
                  toast({
                    title: `Something Went Wrong`,
                    status: 'error',
                    position: 'top-right',
                    duration: 9000,
                    isClosable: true,
                  })
                }
                // trigger a revalidation (refetch) to make sure our local data is correct
                mutate(url)
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

      {data && (
        <Flex justify="space-between" alignItems="center">
          <motion.div
            initial={{ x: '-100vw' }}
            animate={{ x: 0 }}
            transition={{ delay: 1, duration: 2 }}
          >
            <PrimaryButton
              marginX="0"
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
              marginX="0"
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
