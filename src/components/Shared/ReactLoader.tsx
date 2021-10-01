import { LoaderProvider, ThreeDots, useLoading } from '@agney/react-loading'
import React, { ReactElement } from 'react'
import PrimaryButton from './PrimaryButton'

function App({ loadingText = '' }) {
  const { containerProps, indicatorEl } = useLoading({
    loading: true,
  })
  return (
    <section className="p-1.5 flex justify-center" {...containerProps}>
      {loadingText} {indicatorEl}
    </section>
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

export const FullWidthReactLoader = ({ loadingText = '' }) => (
  <PrimaryButton disabled shadow="2xl" width="full" my="2" marginX="0">
    <ReactLoader loadingText={loadingText} />
  </PrimaryButton>
)
