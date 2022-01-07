import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  InputProps
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import React, { ReactNode } from 'react'

interface InputTextAreaFieldProps extends InputProps {
  children?: ReactNode
  label: string
  error?: string
  field: any
  isLeftAddOn?: boolean
  isLeftAddOnValue?: string
}

const InputTextAreaField: NextPage<InputTextAreaFieldProps> = ({
  label,
  error,
  field,
  isLeftAddOn = false,
  isLeftAddOnValue = '',
  ...props
}) => {
  const color = error ? 'red.500' : 'gray.200'
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <InputGroup>
        {isLeftAddOn && (
          <InputLeftAddon fontWeight="semibold">
            {isLeftAddOnValue}
          </InputLeftAddon>
        )}
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

export default InputTextAreaField
