import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  InputProps,
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import React, { ReactNode } from 'react'
import { ControllerRenderProps, FieldValues } from 'react-hook-form'

interface InputTextFieldProps extends InputProps {
  children?: ReactNode
  label: string
  error?: string
  field: ControllerRenderProps<FieldValues, any>
  isLeftAddOn?: boolean
  isLeftAddOnValue?: string
}

const InputTextField: NextPage<InputTextFieldProps> = ({
  label,
  error,
  field,
  isLeftAddOn = false,
  isLeftAddOnValue = '',
  ...props
}) => {
  const color = error ? 'red.500' : 'purple.500'
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <InputGroup>
        {isLeftAddOn && <InputLeftAddon>{isLeftAddOnValue}</InputLeftAddon>}
        <Input
          // focusBorderColor={color}
          borderColor={color}
          fontWeight="semibold"
          fontSize="md"
          {...field}
          {...props}
        />
      </InputGroup>
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

export default InputTextField
