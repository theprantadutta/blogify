import { Box, Heading, useToast } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { User } from '@prisma/client'
import axios from 'axios'
import { motion } from 'framer-motion'
import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { ReactNode, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import InputPasswordField from '../components/FormFields/InputPasswordField'
import Layout from '../components/Layouts/Layout'
import PrimaryButton from '../components/Shared/PrimaryButton'
import ReactLoader from '../components/Shared/ReactLoader'
import withAuth from '../HOCs/withAuth'
import {
  formVariants,
  fromTheLeftVariants,
  fromTheRightVariants,
} from '../util/variants'

interface ChangePasswordProps {
  children?: ReactNode
  user: User | null
}

interface ChangePasswordsType {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const ChangePassword: NextPage<ChangePasswordProps> = ({ user }) => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordsType>({
    resolver: yupResolver(
      yup
        .object({
          currentPassword: yup.string().min(6).required(),
          newPassword: yup.string().min(6).required(),
          confirmPassword: yup
            .string()
            .oneOf([yup.ref('newPassword')], 'Passwords must match')
            .required('Required'),
        })
        .required()
    ),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  })
  const [submitting, setSubmitting] = useState(false)
  const toast = useToast()
  const router = useRouter()
  const onSubmit = async (values: ChangePasswordsType) => {
    setSubmitting(true)
    const { currentPassword, confirmPassword } = values
    try {
      await axios.post('/api/change-password', {
        id: user.id,
        password: currentPassword,
        confirmPassword,
      })
      toast({
        title: `Profile Changed Successfully`,
        status: 'success',
        isClosable: true,
        position: 'top-right',
      })
      return router.push('/')
    } catch (e) {
      setError('currentPassword', {
        type: 'manual',
        message: e?.response?.data?.error || `Something Went Wrong. Try Again`,
      })
      toast({
        title: e?.response?.data?.error || `Please try again`,
        status: 'error',
        isClosable: true,
        position: 'top-right',
      })
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <Layout user={user}>
      <Box width="xl" mx="auto" marginTop="4">
        <Heading my="5" as="h4" fontSize="xl" fontWeight="bold">
          Change Password
        </Heading>

        <motion.form
          variants={formVariants()}
          onSubmit={handleSubmit(onSubmit)}
        >
          <motion.div variants={fromTheLeftVariants()}>
            <Box my="2">
              <Controller
                name="currentPassword"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <InputPasswordField
                    error={errors?.currentPassword?.message}
                    placeholder="Enter Your Current Password"
                    label="Current Password"
                    field={field}
                  />
                )}
              />
            </Box>
          </motion.div>

          <motion.div variants={fromTheRightVariants()}>
            <Box my="2">
              <Controller
                name="newPassword"
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <InputPasswordField
                    error={errors?.newPassword?.message}
                    label="New Password"
                    placeholder="Enter New Password"
                    field={field}
                  />
                )}
              />
            </Box>
          </motion.div>

          <motion.div variants={fromTheLeftVariants()}>
            <Box my="2">
              <Controller
                name="confirmPassword"
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <InputPasswordField
                    error={errors?.confirmPassword?.message}
                    label="Confirm Password"
                    placeholder="Confirm Password"
                    field={field}
                  />
                )}
              />
            </Box>
          </motion.div>

          <PrimaryButton
            disabled={submitting}
            w="100%"
            my="5"
            type="submit"
            marginX="0"
          >
            {submitting ? <ReactLoader /> : 'Update Profile'}
          </PrimaryButton>
        </motion.form>
      </Box>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    const { user } = context

    return { props: { user } }
  }
)

export default ChangePassword
