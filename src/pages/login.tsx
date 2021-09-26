import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
  useToast,
} from '@chakra-ui/react'
import { User } from '@prisma/client'
import axios from 'axios'
import { GetServerSideProps } from 'next'
import { withIronSession } from 'next-iron-session'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import React, { ChangeEvent, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import Layout from '../components/Layout'
import PrimaryButton from '../components/PrimaryButton'
import ReactLoader from '../components/ReactLoader'
import { authAtom } from '../state/authState'
import { NEXT_IRON_SESSION_CONFIG } from '../util/constants'

interface LoginProps {
  user: User | null
}

type LoginForm = {
  email: string
  password: string
}

const Login: React.FC<LoginProps> = ({ user }) => {
  const router = useRouter()
  const toast = useToast()
  const [show, setShow] = useState(false)
  const setAuth = useSetRecoilState(authAtom)
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' })
  const [error, setError] = useState<string | null>('')
  const [loading, setLoading] = useState<boolean>(false)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post('/api/login', form)
      console.log('data: ', data)
      setAuth(data)
      setError(null)
      toast({
        title: `Welcome, ${data.name}`,
        status: 'success',
        isClosable: true,
        position: 'top-right',
      })
      return router.push('/')
    } catch (e) {
      setError(e.response.data.error)
    } finally {
      setLoading(false)
    }
  }
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  return (
    <Layout user={user}>
      <Box width="xl" mx="auto" marginTop="4">
        <Heading as="h4" fontSize="xl" fontWeight="bold">
          Login to your Account
        </Heading>
        <form onSubmit={handleSubmit}>
          <FormControl my="5" id="email">
            <FormLabel>Email Address</FormLabel>
            <Input
              onChange={handleChange}
              type="email"
              placeholder="Enter Your Email"
              fontWeight="semibold"
              fontSize="md"
              name="email"
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
            <FormLabel>Enter Password</FormLabel>
            <InputGroup size="md">
              <Input
                onChange={handleChange}
                placeholder="Enter Your Password"
                type={show ? 'text' : 'password'}
                fontWeight="semibold"
                fontSize="md"
                name="password"
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                  {show ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Flex>
            <PrimaryButton my="5" type="submit" disabled={loading}>
              {loading ? <ReactLoader /> : 'Login'}
            </PrimaryButton>
            <Spacer />
            <PrimaryButton my="5" type="button">
              <Link href="/register">Register Instead</Link>
            </PrimaryButton>
          </Flex>
        </form>
      </Box>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = withIronSession(
  async ({ req, res }) => {
    const user = req.session.get('user')

    if (user) {
      return {
        redirect: {
          permanent: false,
          destination: '/',
        },
        props: {},
      }
    }

    return {
      props: {},
    }
  },
  NEXT_IRON_SESSION_CONFIG
)

export default Login
