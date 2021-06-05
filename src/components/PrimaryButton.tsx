import { Button, ButtonProps } from '@chakra-ui/react'

interface PrimaryButtonProps extends ButtonProps {}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <Button
      marginX="2"
      bgColor="purple.500"
      textColor="white"
      _hover={{ bgColor: 'purple.700' }}
      {...props}
    >
      {children}
    </Button>
  )
}

export default PrimaryButton
