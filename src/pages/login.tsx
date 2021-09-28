import { Box, Flex, Heading, Spacer, useToast } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { User } from '@prisma/client'
import axios from 'axios'
import { motion } from 'framer-motion'
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
import {
  fromTheBottomVariants,
  fromTheLeftVariants,
  fromTheRightVariants,
} from '../util/variants'

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
  const setAuth = useSetRecoilState(authAtom)
  const [loading, setLoading] = useState<boolean>(false)

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(
      yup
        .object({
          email: yup.string().email('Invalid email').required(),
          password: yup.string().min(6).required(),
        })
        .required()
    ),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  })

  const onSubmit = async (values: LoginForm) => {
    setLoading(true)
    try {
      const { data } = await axios.post('/api/login', values)
      console.log('data: ', data)
      setAuth(data)
      toast({
        title: `Welcome, ${data.name}`,
        status: 'success',
        isClosable: true,
        position: 'top-right',
      })
      return router.push('/')
    } catch (e) {
      setError('email', {
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
        <Heading my="5" as="h4" fontSize="xl" fontWeight="bold">
          Login to your Account
        </Heading>

        <form onSubmit={handleSubmit(onSubmit)}>
          <motion.div variants={fromTheLeftVariants(0.2)}>
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
          </motion.div>

          <motion.div variants={fromTheRightVariants()}>
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
          </motion.div>

          <motion.div variants={fromTheBottomVariants()}>
            <Flex>
              <PrimaryButton my="5" type="submit" disabled={loading}>
                {loading ? <ReactLoader /> : 'Login'}
              </PrimaryButton>
              <Spacer />
              <PrimaryButton my="5" type="button">
                <Link href="/register">Register Instead</Link>
              </PrimaryButton>
            </Flex>
          </motion.div>
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
