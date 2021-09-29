import { Box, ChakraProvider } from '@chakra-ui/react'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { AppProps } from 'next/app'
import NextNprogress from 'nextjs-progressbar'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { RecoilRoot } from 'recoil'
import Navbar from '../components/Navbar'
import theme from '../theme'

const queryClient = new QueryClient()

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider resetCSS theme={theme}>
          <NextNprogress
            color="#805AD5"
            startPosition={0.3}
            stopDelayMs={200}
            height={3}
            options={{ easing: 'ease', speed: 500, showSpinner: true }}
          />
          <Box maxWidth="4xl" marginX="auto" marginTop="2">
            <Navbar />
          </Box>
          <AnimatePresence exitBeforeEnter>
            <motion.div key={router.route} {...pageMotionProps}>
              <Component {...pageProps} />
            </motion.div>
          </AnimatePresence>
        </ChakraProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </RecoilRoot>
  )
}

export default MyApp

const pageVariants: Variants = {
  hidden: {
    // backgroundColor: '#eee',
    // filter: `invert()`,
    opacity: 0,
    x: '-100vw',
  },
  visible: {
    // backgroundColor: 'transparent',
    // filter: ``,
    opacity: 1,
    x: 0,
    transition: { delay: 0.2, duration: 0.5, stiffness: 200 },
  },
  exit: {
    // backgroundColor: '#eee',
    // filter: `invert()`,
    opacity: 0,
    x: '-100vw',
    transition: { delay: 0.2, duration: 0.5, stiffness: 200 },
  },
}

export const pageMotionProps = {
  initial: 'hidden',
  animate: 'visible',
  exit: 'exit',
  variants: pageVariants,
}
