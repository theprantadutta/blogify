import dayjs from 'dayjs'

export function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

export const eighteenYearsBackFromNow = (formatter: string) =>
  dayjs().subtract(18, 'year').format(formatter)

export const detectPluralOrSingular = (unit: number, word: string) => {
  if (unit === 1) {
    return unit.toString() + ' ' + word
  }
  return unit.toString() + ' ' + word + 's'
}
