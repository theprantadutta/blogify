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
import { motion } from 'framer-motion'
import router from 'next/router'
import React from 'react'
import { useRecoilValue } from 'recoil'
import useSWR, { useSWRConfig } from 'swr'
import { authAtom } from '../state/authState'
import PrimaryButton from './PrimaryButton'

interface SinglePostProps {
  post: Post
}

const SinglePost: React.FC<SinglePostProps> = ({ post }) => {
  const auth = useRecoilValue(authAtom)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const { data } = useSWR('/posts?page=1')
  const { mutate } = useSWRConfig()
  const ownership = auth?.id === post.userId

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
      <motion.div
        initial={{ y: '100vh' }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Text as="p" my="2" fontSize="xl">
          {post.content}
        </Text>
      </motion.div>
    </Box>
  )
}

export default SinglePost
