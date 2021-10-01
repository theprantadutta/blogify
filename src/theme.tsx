import { extendTheme } from '@chakra-ui/react'
import { createBreakpoints } from '@chakra-ui/theme-tools'

const fonts = { mono: `'Menlo', monospace` }

const breakpoints = createBreakpoints({
  sm: '40em',
  md: '52em',
  lg: '64em',
  xl: '80em',
})

const theme = extendTheme({
  colors: {
    black: '#16161D',
    primary: 'purple.700',
  },
  fonts,
  breakpoints,
  styles: {
    global: {
      'html, body': {
        // overflowX: 'hidden',
        // overflowY: 'scroll',
        // overflow: 'scroll',
      },
    },
  },
})

export default theme
