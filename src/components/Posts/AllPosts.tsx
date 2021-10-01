import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import {
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  IconButton,
  Select,
  Spacer,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { motion } from 'framer-motion'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import React, { useState } from 'react'
import { AiFillLike, AiOutlineLike } from 'react-icons/ai'
import { useRecoilValue } from 'recoil'
import useSWR, { useSWRConfig } from 'swr'
import { authAtom } from '../../state/authState'
import { detectPluralOrSingular } from '../../util/functions'
import { ExtendedPost, PostsWithIsNext } from '../../util/types'
import DeleteModal from '../Shared/DeleteModal'
import PrimaryButton from '../Shared/PrimaryButton'
import { FullWidthReactLoader } from '../Shared/ReactLoader'

interface AllPostsProps {}

const AllPosts: React.FC<AllPostsProps> = () => {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()
  const auth = useRecoilValue(authAtom)
  const [postMode, setPostMode] = useState<'all' | 'my'>('all')
  const [page, setPage] = useState(1)

  const url =
    postMode === 'all'
      ? `/posts?page=${page}`
      : `/posts?page=${page}&id=${auth?.id}`

  const { data, error }: { data?: PostsWithIsNext; error?: any } = useSWR(url, {
    refreshInterval: 1000 * 60 * 5,
  })

  const { mutate } = useSWRConfig()

  // to delete the post, as we are using modal,
  // we need another state to control deletable id
  const [postId, setPostId] = useState(0)

  dayjs.extend(relativeTime)

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
      {!data && !error && (
        <FullWidthReactLoader loadingText={'Loading Text....'} />
      )}
      {data?.posts &&
        data?.posts.map((post, index) => {
          let isLiked = false
          for (let i = 0; i < post?.likes?.length; i++) {
            if (post?.likes[i]?.userId === auth?.id) {
              isLiked = true
              break
            }
          }
          return (
            <motion.div
              initial={{ x: index % 2 === 0 ? '-100vw' : '100vw' }}
              animate={{ x: 0 }}
              transition={{ delay: 0.5 * index, duration: 0.8, stiffness: 120 }}
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
                      isLiked ? (
                        <AiFillLike style={{ color: 'purple' }} />
                      ) : (
                        <AiOutlineLike style={{ color: 'purple' }} />
                      )
                    }
                    onClick={async () => {
                      if (isLiked) {
                        let newPosts: ExtendedPost[] = []
                        let likeId: number
                        data.posts.forEach((p) => {
                          if (p.id === post.id) {
                            newPosts.push({
                              ...p,
                              likes: p.likes.filter((like) => {
                                if (like.userId === auth?.id) {
                                  likeId = like.id
                                  return false
                                }
                                return true
                              }),
                            })
                          } else {
                            newPosts.push(p)
                          }
                        })
                        mutate(
                          url,
                          {
                            ...data,
                            posts: newPosts,
                          },
                          false
                        )
                        await axios.get(`/unlike-post/?id=${likeId}`)
                        mutate(url)
                      } else {
                        let newPosts: ExtendedPost[] = []
                        data.posts.forEach((p) => {
                          if (p.id === post.id) {
                            newPosts.push({
                              ...p,
                              likes: [
                                ...p.likes,
                                {
                                  id: Math.floor(Math.random() * 100),
                                  userId: auth?.id,
                                  postId: post.id,
                                },
                              ],
                            })
                          } else {
                            newPosts.push(p)
                          }
                        })
                        mutate(
                          url,
                          {
                            ...data,
                            posts: newPosts,
                          },
                          false
                        )
                        await axios.get(
                          `/like-post/?postId=${post.id}&userId=${auth?.id}`
                        )
                        mutate(url)
                      }
                    }}
                  />
                  <Text as="p" fontWeight="semibold">
                    {detectPluralOrSingular(post?.likes?.length ?? 0, 'Like')}
                  </Text>
                  <Center height="10px">
                    <Divider orientation="vertical" />
                  </Center>
                  <Text
                    as="p"
                    marginLeft="5"
                    fontWeight="semibold"
                    _hover={{
                      fontWeight: 'bold',
                      color: 'purple.500',
                      cursor: 'pointer',
                    }}
                    onClick={() => router.push(`/posts/${post.id}#comments`)}
                  >
                    <Text ml="3" as="span" fontWeight="semibold">
                      {detectPluralOrSingular(
                        (post as any)?._count?.comments ?? 0,
                        'Comment'
                      )}
                    </Text>
                  </Text>
                  <Center height="10px">
                    <Divider orientation="vertical" />
                  </Center>
                  <Text marginLeft="5" as="p" fontWeight="medium">
                    {dayjs(post.createdAt).fromNow()}
                  </Text>
                </Flex>
              </Box>
            </motion.div>
          )
        })}

      <DeleteModal
        onClose={onClose}
        isOpen={isOpen}
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
      />
      {data?.posts?.length === 0 && (
        <Box my="2">
          <Text as="p" fontSize="xl" fontWeight="semibold" my="5">
            No Posts Yet
          </Text>
        </Box>
      )}

      {error && (
        <Box my="2">
          <Text as="p" fontSize="xl" fontWeight="semibold" my="5">
            Something Went Wrong. Try Again Later
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
