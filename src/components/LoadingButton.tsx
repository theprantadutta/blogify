import { Button, ButtonOptions } from '@chakra-ui/react'

interface ButtonProps {
  loadingText: string
  buttonProps?: ButtonOptions
}

const LoadingButton: React.FC<ButtonProps> = ({ loadingText, buttonProps }) => {
  return (
    <Button
      {...buttonProps}
      marginX="2"
      bgColor="purple.500"
      textColor="white"
      _hover={{ bgColor: 'purple.700' }}
      isLoading
      loadingText={loadingText}
    />
  )
}

export default LoadingButton
