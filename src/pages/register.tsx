import { Box, Flex, Heading, Spacer } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { User } from '@prisma/client'
import axios from 'axios'
import { GetServerSideProps } from 'next'
import { withIronSession } from 'next-iron-session'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useSetRecoilState } from 'recoil'
import * as yup from 'yup'
import InputPasswordField from '../components/FormFields/InputPasswordField'
import InputTextField from '../components/FormFields/InputTextField'
import Layout from '../components/Layout'
import PrimaryButton from '../components/PrimaryButton'
import ReactLoader from '../components/ReactLoader'
import { authAtom } from '../state/authState'
import { NEXT_IRON_SESSION_CONFIG } from '../util/constants'

interface RegisterProps {
  user: User | null
}

type RegisterForm = {
  name: string
  email: string
  password: string
}

const Register: React.FC<RegisterProps> = ({ user }) => {
  const router = useRouter()
  const setAuth = useSetRecoilState(authAtom)
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: yupResolver(
      yup
        .object({
          name: yup.string().required(),
          email: yup
            .string()
            .email('Invalid email')
            .test(
              'Unique Email',
              'Email already been taken',
              async function (value) {
                try {
                  await axios.post('/api/unique-email', {
                    email: value,
                  })
                  return true
                } catch (e) {
                  return false
                }
              }
            )
            .required(),
          password: yup.string().min(6).required(),
        })
        .required()
    ),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  })
  const [loading, setLoading] = useState<boolean>(false)
  const onSubmit = async (values: RegisterForm) => {
    setLoading(true)
    try {
      const { data } = await axios.post('/api/register', values)
      setAuth(data)
      return router.push('/')
    } catch (e) {
      setError('name', {
        type: 'manual',
        message: e?.response?.data?.error || `Something Went Wrong. Try Again`,
      })
    } finally {
      setLoading(false)
    }
  }
  return (
    <Layout user={user}>
      <Box width="xl" mx="auto" marginTop="4">
        <Heading as="h4" fontSize="xl" fontWeight="bold">
          Login to your Account
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mt="5">
            <Controller
              name="name"
              control={control}
              defaultValue={''}
              render={({ field }) => (
                <InputTextField
                  error={errors?.name?.message}
                  label="Enter Your Name"
                  placeholder="Your Name"
                  field={field}
                />
              )}
            />
          </Box>

          <Box my="5">
            <Controller
              name="email"
              control={control}
              defaultValue={''}
              render={({ field }) => (
                <InputTextField
                  error={errors?.email?.message}
                  label="Enter Your Email"
                  placeholder="johndoe@gmail.com"
                  field={field}
                />
              )}
            />
          </Box>

          <Box mt="5">
            <Controller
              name="password"
              control={control}
              defaultValue={''}
              render={({ field }) => (
                <InputPasswordField
                  error={errors?.password?.message}
                  label="Enter Your Passsword"
                  placeholder="Your password here"
                  field={field}
                />
              )}
            />
          </Box>

          <Flex>
            <PrimaryButton my="5" type="submit" disabled={loading}>
              {loading ? <ReactLoader /> : 'Register'}
            </PrimaryButton>
            <Spacer />
            <PrimaryButton my="5" type="button">
              <Link href="/login">Login Instead</Link>
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

export default Register
