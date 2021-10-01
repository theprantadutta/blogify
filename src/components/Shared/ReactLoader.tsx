import { LoaderProvider, ThreeDots, useLoading } from '@agney/react-loading'
import { Box } from '@chakra-ui/react'
import React, { ReactElement } from 'react'
import PrimaryButton from './PrimaryButton'

function App({ loadingText = '' }) {
  const { containerProps, indicatorEl } = useLoading({
    loading: true,
  })
  return (
    <Box
      className="p-1.5 flex justify-center"
      {...containerProps}
      fontWeight="semibold"
    >
      {loadingText} {indicatorEl}
    </Box>
  )
}

interface ReactLoaderProps {
  component?: ReactElement
  loadingText?: string
}

const ReactLoader: React.FC<ReactLoaderProps> = ({
  component,
  loadingText,
}) => {
  return (
    <LoaderProvider
      indicator={component ? component : <ThreeDots width="50" />}
    >
      <App loadingText={loadingText} />
    </LoaderProvider>
  )
}

export default ReactLoader

export const FullWidthReactLoader = () => (
  <PrimaryButton disabled shadow="2xl" width="full" my="2" marginX="0">
    <ReactLoader />
  </PrimaryButton>
)
