import { Box, Flex, Heading, useToast } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { User } from '@prisma/client'
import axios from 'axios'
import dayjs from 'dayjs'
import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { ReactNode, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useSetRecoilState } from 'recoil'
import * as yup from 'yup'
import InputDateField from '../components/FormFields/InputDateField'
import InputSelectField from '../components/FormFields/InputSelectField'
import InputTextField from '../components/FormFields/InputTextField'
import Layout from '../components/Layout'
import PrimaryButton from '../components/PrimaryButton'
import ReactLoader from '../components/ReactLoader'
import withAuth from '../HOCs/withAuth'
import { authAtom } from '../state/authState'
import { eighteenYearsBackFromNow } from '../util/functions'

interface EditProfileProps {
  children?: ReactNode
  user: User | null
}

const EditProfile: NextPage<EditProfileProps> = ({ user }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
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
                    id: user.id,
                  })
                  return true
                } catch (e) {
                  return false
                }
              }
            )
            .required(),
          mobileNo: yup
            .number()
            .typeError('Mobile No. must be a number')
            .test(
              'len',
              'Mobile No must be 11 characters',
              (val) => val?.toString().length === 10
            )
            .required('Required'),
          gender: yup.string().oneOf(['male', 'female']).required(),
          dateOfBirth: yup
            .date()
            .max(
              eighteenYearsBackFromNow('YYYY-MM-DD').toString(),
              'You Must be 18 Years Old'
            )
            .required('Invalid Date'),
        })
        .required()
    ),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  })
  const [submitting, setSubmitting] = useState(false)
  const toast = useToast()
  const router = useRouter()
  const setAuth = useSetRecoilState(authAtom)
  const onSubmit = async (values: User) => {
    setSubmitting(true)
    const { name, email, dateOfBirth, gender, mobileNo } = values
    try {
      const { data } = await axios.post('/api/update-profile', {
        id: user.id,
        name,
        email,
        dateOfBirth,
        gender,
        mobileNo,
      })
      toast({
        title: `Profile Successfully Updated`,
        status: 'success',
        isClosable: true,
        position: 'top-right',
      })
      setAuth(data)
      return router.push('/')
    } catch (e) {
      toast({
        title: `Please try again`,
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
      <Box mx="auto" marginTop="4">
        <Heading my="5" as="h4" fontSize="xl" fontWeight="bold">
          Edit Profile
        </Heading>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box my="2">
            <Controller
              name="name"
              control={control}
              defaultValue={user.name}
              render={({ field }) => (
                <InputTextField
                  error={errors?.name?.message}
                  label="Your Name"
                  field={field}
                />
              )}
            />
          </Box>

          <Flex gridGap="5" my="2">
            <Controller
              name="email"
              control={control}
              defaultValue={user.email}
              render={({ field }) => (
                <InputTextField
                  error={errors?.email?.message}
                  label="Your Email"
                  field={field}
                />
              )}
            />
            <Controller
              name="mobileNo"
              control={control}
              defaultValue={(user.mobileNo as any) ?? 0o1}
              render={({ field }) => (
                <InputTextField
                  error={errors?.mobileNo?.message}
                  isLeftAddOn
                  isLeftAddOnValue="+880"
                  label="Your Mobile No"
                  field={field}
                />
              )}
            />
          </Flex>

          <Flex gridGap="5">
            <Controller
              name="gender"
              control={control}
              defaultValue={user?.gender ?? ''}
              render={({ field }) => (
                <InputSelectField
                  options={['male', 'female']}
                  label="Your Gender"
                  error={errors?.gender?.message}
                  field={field}
                />
              )}
            />
            <Controller
              name="dateOfBirth"
              control={control}
              defaultValue={
                user.dateOfBirth
                  ? (dayjs(user?.dateOfBirth).format('YYYY-MM-DD') as any)
                  : (dayjs().subtract(18, 'year').format('YYYY-MM-DD') as any)
              }
              render={({ field }) => (
                <InputDateField
                  placeholder="Enter Your Birth Date"
                  label="Your Date of Birth"
                  error={errors?.dateOfBirth?.message}
                  field={field}
                />
              )}
            />
          </Flex>

          <PrimaryButton
            disabled={submitting}
            w="100%"
            my="5"
            type="submit"
            marginX="0"
          >
            {submitting ? <ReactLoader /> : 'Update Profile'}
          </PrimaryButton>
        </form>
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

export default EditProfile
