import { Heading } from '@chakra-ui/react'

interface ComponentTitleProps {
  title: string
}

const ComponentTitle: React.FC<ComponentTitleProps> = ({ title }) => {
  return (
    <Heading as="h4" fontSize="xl" fontWeight="bold">
      {title}
    </Heading>
  )
}

export default ComponentTitle
