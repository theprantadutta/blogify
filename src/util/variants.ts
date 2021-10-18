export const formVariants = (delay: number = 0.5, duration: number = 0.5) => {
  return {
    hidden: { y: '-100vh' },
    visible: { y: 0, transition: { delay, duration } },
  }
}

export const fromTheLeftVariants = (
  delay: number = 0.5,
  duration: number = 1
) => {
  return {
    hidden: { x: '-100vw' },
    visible: { x: 0, transition: { delay, duration } },
  }
}

export const fromTheRightVariants = (
  delay: number = 0.5,
  duration: number = 1
) => {
  return {
    hidden: { x: '100vw' },
    visible: { x: 0, transition: { delay, duration } },
  }
}

export const fromTheTopVariants = (
  delay: number = 0.5,
  duration: number = 1
) => {
  return {
    hidden: { y: '-100vh' },
    visible: { y: 0, transition: { delay, duration } },
  }
}

export const fromTheBottomVariants = (
  delay: number = 0.5,
  duration: number = 1
) => {
  return {
    hidden: { y: '100vh' },
    visible: { y: 0, transition: { delay, duration } },
  }
}

export const opacityVariants = (delay: number = 0.5, duration: number = 1) => {
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay, duration: duration } },
  }
}
