import {
  Box,
  Button,
  Divider,
  Flex,
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
import React, { useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { useRecoilState } from 'recoil'
import { authAtom } from '../../state/authState'
import { NavButtonLinks } from '../../util/types'
import BlogifySVG from './BlogifySVG'
// import { useGetUser } from './Layout'
import PrimaryButton from './PrimaryButton'
import ReactLoader from './ReactLoader'

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const toast = useToast()
  const router = useRouter()
  const [auth, setAuth] = useRecoilState(authAtom)
  const [loading, setLoading] = useState(false)
  return (
    <Flex alignItems="center">
      <Box onClick={() => router.push('/')}>
        <BlogifySVG />
      </Box>
      <Spacer />
      <Box my="4">
        {auth ? (
          <>
            {LoggedInLinks.map((link) => {
              return (
                <PrimaryButton key={link.title}>
                  <Link href={link.link} passHref>
                    {link.title}
                  </Link>
                </PrimaryButton>
              )
            })}
            <Popover
              placement="bottom-end"
              matchWidth
              closeOnBlur
              trigger="hover"
            >
              <PopoverTrigger>
                <IconButton
                  marginLeft="2"
                  _focus={{ ring: 0 }}
                  aria-label="User ICON"
                  size="md"
                  variant="outline"
                  icon={<Icon as={FaUserCircle} />}
                  colorScheme="purple"
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
                    <Link href={`/edit-profile`} passHref>
                      Edit Profile
                    </Link>
                  </Button>
                  <Divider />
                  <Button textColor="purple.600" my="1">
                    <Link href={`/change-password`} passHref>
                      Change Password
                    </Link>
                  </Button>
                  <Divider />
                  <Button
                    textColor="purple.600"
                    my="2"
                    onClick={async () => {
                      setLoading(true)
                      try {
                        await axios.post('/logout')
                        toast({
                          title: `Logout Successful`,
                          variant: 'left-accent',
                          status: 'info',
                          position: 'top-right',
                          isClosable: true,
                        })
                        setAuth(null)
                        router.push('/')
                      } catch (e) {
                        console.log('Error in Logging Out', e.response)
                      } finally {
                        setLoading(false)
                      }
                    }}
                  >
                    {loading ? <ReactLoader /> : 'Logout'}
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
