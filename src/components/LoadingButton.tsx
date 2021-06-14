import { Button, ButtonProps } from '@chakra-ui/react'

interface LoadingButtonProps extends ButtonProps {
  loadingText?: string
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  loadingText = 'Loading',
  ...props
}) => {
  return (
    <Button
      {...props}
      my="2"
      w="full"
      bgColor="purple.700"
      textColor="white"
      isLoading
      _focus={{ bgColor: 'purple.900' }}
      loadingText={loadingText}
    />
  )
}

export default LoadingButton
