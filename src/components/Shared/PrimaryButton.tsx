import { Button, ButtonProps } from '@chakra-ui/react'

interface PrimaryButtonProps extends ButtonProps {
  marginX?: string | number
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  marginX = '2',
  children,
  ...props
}) => {
  return (
    <Button
      marginX={marginX}
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
