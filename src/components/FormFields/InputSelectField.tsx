import {
  FormControl,
  FormHelperText,
  FormLabel,
  Select,
  SelectProps,
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import React, { ReactNode } from 'react'
import { ControllerRenderProps, FieldValues } from 'react-hook-form'

interface InputSelectFieldProps extends SelectProps {
  children?: ReactNode
  label: string
  error?: string
  options: string[]
  field: ControllerRenderProps<FieldValues, any>
}

const InputSelectField: NextPage<InputSelectFieldProps> = ({
  label,
  error,
  field,
  options,
  ...props
}) => {
  const color = error ? 'red.500' : 'gray.200'
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      {/* <Input fontWeight="semibold" fontSize="md" {...field} {...props} /> */}
      <Select
        fontWeight="semibold"
        placeholder="Choose One"
        // focusBorderColor={color}
        borderColor={color}
        textTransform="capitalize"
        {...props}
        {...field}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
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

export default InputSelectField
