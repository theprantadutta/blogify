import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { motion } from 'framer-motion'
import Image from 'next/image'
import router from 'next/router'
import React, { useEffect, useState } from 'react'
import { AiFillLike, AiOutlineLike } from 'react-icons/ai'
import { useRecoilValue } from 'recoil'
import useSWR, { useSWRConfig } from 'swr'
import { authAtom } from '../../state/authState'
import { detectPluralOrSingular } from '../../util/functions'
import { ExtendedPost } from '../../util/types'
import DeleteModal from '../Shared/DeleteModal'
import PrimaryButton from '../Shared/PrimaryButton'

interface SinglePostProps {
  post: ExtendedPost
}

const SinglePost: React.FC<SinglePostProps> = ({ post }) => {
  const auth = useRecoilValue(authAtom)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const { data } = useSWR('/posts?page=1')
  const { mutate } = useSWRConfig()
  const ownership = auth?.id === post.userId

  const url = '/single-post/' + post.id
  const [isLiked, setIsLiked] = useState(false)
  useEffect(() => {
    for (let i = 0; i < post?.likes.length; i++) {
      if (post?.likes[i]?.userId === auth?.id) {
        setIsLiked(true)
        break
      }
    }
  }, [auth?.id, isLiked, post?.likes])

  const commentsUrl = `/comments?postId=${post?.id}`
  const { data: comments } = useSWR(commentsUrl)
  const [comment, setComment] = useState('')
  const handleChange = (event) => setComment(event.target.value)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!comment) {
      toast({
        title: `Please Type Something to comment`,
        status: 'error',
        position: 'top-right',
        duration: 9000,
        isClosable: true,
      })
      return
    }

    // Removes focus from the input field
    if ('activeElement' in document) (document as any).activeElement.blur()

    setComment('')
    const newComment = {
      postId: post.id,
      userId: auth?.id,
      content: comment,
      id: Math.floor(Math.random() * 100),
      createdAt: new Date(),
      user: {
        name: auth?.name,
      },
    }
    mutate(commentsUrl, [newComment, ...comments], false)
    await axios.post('/comments', newComment)
    mutate(commentsUrl)
  }
  dayjs.extend(relativeTime)
  return (
    <Box>
      <Flex justify={ownership ? 'space-between' : 'start'} alignItems="center">
        <Flex justify={'space-between'} alignItems="center">
          <Button colorScheme="purple" onClick={() => router.back()}>
            Go Back
          </Button>
          <motion.div
            initial={{ y: '-100vh' }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Text as="p" fontSize="2xl" fontWeight="bold" my="2" ml="2">
              {post.title}
            </Text>
          </motion.div>
        </Flex>
        {auth?.id === post.userId && (
          <Box>
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
              ml={2}
              variant="outline"
              colorScheme="red"
              aria-label="Call Sage"
              fontSize="20px"
              icon={<DeleteIcon />}
              onClick={onOpen}
            />

            <DeleteModal
              onClose={onClose}
              isOpen={isOpen}
              onClick={async () => {
                mutate(
                  '/posts?page=1',
                  {
                    ...data,
                    posts: data.posts.filter((p) => p.id !== post.id),
                  },
                  false
                )
                onClose()
                router.push('/posts')
                try {
                  await axios.delete('/single-post/' + post.id)
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
                } finally {
                  mutate('/posts?page=1')
                }
              }}
            />
          </Box>
        )}
      </Flex>
      <motion.div
        initial={{ y: '100vh' }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Text as="p" my="2" fontSize="xl">
          {post.content}
        </Text>
        <Flex justify="start" alignItems="center">
          <Text as="p" fontWeight="semibold">
            By{' '}
            <Text as="span" fontWeight="bold" marginRight={'1'}>
              {post?.user?.name}
            </Text>
          </Text>
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
                setIsLiked(false)
                let likeId: number
                mutate(
                  url,
                  {
                    ...post,
                    likes: post.likes.filter((like) => {
                      if (like.userId === auth?.id) {
                        likeId = like.id
                        return false
                      }
                      return true
                    }),
                  },
                  false
                )
                await axios.get(`/unlike-post/?id=${likeId}`)
                mutate(url)
              } else {
                setIsLiked(true)
                mutate(
                  url,
                  {
                    ...post,
                    likes: [
                      ...post.likes,
                      {
                        id: Math.floor(Math.random() * 100),
                        userId: auth.id,
                        postId: post.id,
                      },
                    ],
                  },
                  false
                )
                await axios.get(
                  `/like-post/?postId=${post.id}&userId=${auth.id}`
                )
                mutate(url)
              }
            }}
          />
          <Text as="p" fontWeight="semibold">
            {detectPluralOrSingular(post?.likes?.length ?? 0, 'Like')}
          </Text>
          <Text ml="3" as="p" fontWeight="semibold">
            {detectPluralOrSingular(comments?.length ?? 0, 'Comment')}
          </Text>
        </Flex>
        <Text fontSize="2xl" id="comments" as="h4" fontWeight="bold">
          Comments
        </Text>
        <form onSubmit={handleSubmit}>
          <Box w="xl" my="2">
            <Input
              value={comment}
              onChange={handleChange}
              fontWeight="semibold"
              placeholder="Type Comment Here..."
            />
            <PrimaryButton my="2" marginLeft="0" type="submit">
              Submit
            </PrimaryButton>
          </Box>
        </form>
        {comments?.length > 0 ? (
          comments.map((comment, index) => {
            return (
              <motion.div
                initial={{ x: index % 2 === 0 ? '-100vw' : '100vw' }}
                animate={{ x: 0 }}
                transition={{
                  delay: 0.5 * index,
                  duration: 0.8,
                  stiffness: 120,
                }}
                key={comment.id}
              >
                <Box my="5">
                  <Flex alignItems="center" gridGap="5" style={{ height: 50 }}>
                    <Image
                      src={`https://ui-avatars.com/api/?name=${comment.user.name}&background=random`}
                      height="40"
                      width="40"
                      alt="user name"
                    />
                    <Stack>
                      <Text my="0" fontWeight="bold">
                        {comment.content}
                      </Text>
                      <Text my="0" fontWeight="semibold">
                        By{' '}
                        <Text as="span" fontWeight={'bold'}>
                          {comment?.user?.name},{' '}
                        </Text>
                        {dayjs(comment.createdAt).fromNow()}
                      </Text>
                    </Stack>
                  </Flex>
                </Box>
              </motion.div>
            )
          })
        ) : (
          <Text fontWeight="semibold" my={2}>
            No Comments Yet
          </Text>
        )}
      </motion.div>
    </Box>
  )
}

export default SinglePost
