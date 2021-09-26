import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputProps,
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import React, { ReactNode } from 'react'
import { ControllerRenderProps, FieldValues } from 'react-hook-form'

interface InputDateFieldProps extends InputProps {
  children?: ReactNode
  label: string
  error?: string
  field: ControllerRenderProps<FieldValues, any>
}

const InputDateField: NextPage<InputDateFieldProps> = ({
  label,
  error,
  field,
  ...props
}) => {
  const color = error ? 'red.500' : 'purple.500'
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Input
        fontWeight="semibold"
        // focusBorderColor={color}
        borderColor={color}
        fontSize="md"
        type="date"
        {...field}
        {...props}
      />
      <FormHelperText
        textTransform="capitalize"
        fontWeight="semibold"
        color="red.500"
        fontStyle="italic"
      >
        {error}
      </FormHelperText>
    </FormControl>
  )
}

export default InputDateField
