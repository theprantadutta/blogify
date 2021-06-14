import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spacer,
  useToast,
} from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import React from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { useRecoilState } from 'recoil'
import { authAtom } from '../state/authState'
import { NavButtonLinks } from '../util/types'
import { useGetUser } from './Layout'
import PrimaryButton from './PrimaryButton'

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const toast = useToast()
  const { push } = useRouter()
  const [auth, setAuth] = useRecoilState(authAtom)
  const { refetch } = useGetUser()
  return (
    <Flex alignItems="center">
      <Box>
        <Heading size="md" as="h1">
          Blogify
        </Heading>
      </Box>
      <Spacer />
      <Box m="4">
        {auth ? (
          <>
            {LoggedInLinks.map((link) => {
              return (
                <PrimaryButton key={link.title}>
                  <Link href={link.link}>{link.title}</Link>
                </PrimaryButton>
              )
            })}
            <Popover placement="bottom-end" matchWidth>
              <PopoverTrigger>
                <IconButton
                  _focus={{ ring: 0 }}
                  aria-label="Call Segun"
                  size="md"
                  variant="outline"
                  icon={<Icon as={FaUserCircle} />}
                />
              </PopoverTrigger>
              <PopoverContent textAlign="right" _focus={{ ring: 0 }}>
                <PopoverHeader fontWeight="semibold">
                  Welcome, {auth.name}
                </PopoverHeader>
                <PopoverArrow />
                {/* <PopoverCloseButton /> */}
                <PopoverBody>
                  <Button textColor="purple.600" my="1">
                    <Link href={`/users/${auth.id}`}>Edit Profile</Link>
                  </Button>
                  <Divider />
                  <Button
                    textColor="purple.600"
                    my="2"
                    onClick={async () => {
                      try {
                        await axios.post('/api/logout')
                        refetch()
                        setAuth(null)
                        toast({
                          title: `Logout Successful`,
                          variant: 'left-accent',
                          status: 'info',
                          position: 'top-right',
                          isClosable: true,
                        })
                        return push('/')
                      } catch (e) {
                        console.log('Error in Logging Out', e.response)
                      }
                    }}
                  >
                    Logout
                  </Button>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </>
        ) : (
          <>
            {LoggedOutLinks.map((link) => {
              return (
                <PrimaryButton key={link.title}>
                  <Link href={link.link}>{link.title}</Link>
                </PrimaryButton>
              )
            })}
          </>
        )}
      </Box>
    </Flex>
  )
}

export default Navbar

const LoggedOutLinks: NavButtonLinks[] = [
  {
    link: '/',
    title: 'Home',
  },
  {
    link: '/login',
    title: 'Login',
  },
  {
    link: '/register',
    title: 'Register',
  },
]

const LoggedInLinks: NavButtonLinks[] = [
  {
    link: '/',
    title: 'Home',
  },
  {
    link: '/posts',
    title: 'Posts',
  },
  {
    link: '/posts/create',
    title: 'Create Post',
  },
]
