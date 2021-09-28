import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { Post } from '@prisma/client'
import axios from 'axios'
import router from 'next/router'
import React from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useRecoilValue } from 'recoil'
import { authAtom } from '../state/authState'
import { PostsWithIsNext } from './AllPosts'
import PrimaryButton from './PrimaryButton'

interface SinglePostProps {
  post: Post
}

const SinglePost: React.FC<SinglePostProps> = ({ post }) => {
  const auth = useRecoilValue(authAtom)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const queryClient = useQueryClient()

  const isNextPage =
    queryClient.getQueryData<PostsWithIsNext>(['all-posts', 'all', post.id])
      ?.isNextPage || false

  const totalPage =
    queryClient.getQueryData<PostsWithIsNext>(['all-posts', 'all', post.id])
      ?.totalPage || 0

  const deletePostMutation = useMutation(
    (id: number) => axios.delete('/api/delete-post/' + id),
    {
      onSuccess: () => {
        toast({
          title: `Post deleted successfully`,
          status: 'success',
          position: 'top-right',
          duration: 9000,
          isClosable: true,
        })
        return router.push('/posts')
      },
      onMutate: async (id: number) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(['all-posts', 'all', 1])

        // Snapshot the previous value
        const posts = queryClient
          .getQueryData<PostsWithIsNext>(['all-posts', 'all', 1])
          .posts.filter((post) => post.id !== id)

        // Optimistically update to the new value
        queryClient.setQueryData<PostsWithIsNext>(['all-posts', 'all', 1], {
          posts,
          isNextPage,
          totalPage,
        })

        return { posts, isNextPage }
      },

      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (_err, _variables, context) => {
        if (
          'posts' in context &&
          'isNextPage' in context &&
          'totalPage' in context
        ) {
          queryClient.setQueryData<PostsWithIsNext>(['all-posts', 'all', 1], {
            posts: context.posts,
            isNextPage,
            totalPage,
          })
        }
      },

      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(['all-posts', 'all', 1])
      },
    }
  )

  const ownership = auth?.id === post.userId

  return (
    <Box>
      <Flex justify={ownership ? 'space-between' : 'start'} alignItems="center">
        <Flex justify={'space-between'} alignItems="center">
          <Button colorScheme="purple" onClick={() => router.back()}>
            Go Back
          </Button>
          <Text as="p" fontSize="2xl" fontWeight="bold" my="2" ml="2">
            {post.title}
          </Text>
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
            <Modal
              closeOnOverlayClick={false}
              isOpen={isOpen}
              onClose={onClose}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Delete A Post</ModalHeader>
                <ModalCloseButton />
                <ModalBody fontSize="xl" fontWeight="bold" pb={6}>
                  You are Deleting a Post. Are You Sure?
                </ModalBody>

                <ModalFooter>
                  <PrimaryButton
                    onClick={() => {
                      deletePostMutation.mutate(post.id)
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
          </Box>
        )}
      </Flex>
      <Text as="p" my="2" fontSize="xl">
        {post.content}
      </Text>
    </Box>
  )
}

export default SinglePost
