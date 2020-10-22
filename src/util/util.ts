export function uniq<T>(array: T[]): T[] {
  const res = [] as T[]
  array.forEach(el => {
    if (res.indexOf(el) < 0) {
      res.push(el)
    }
  })
  return res
}