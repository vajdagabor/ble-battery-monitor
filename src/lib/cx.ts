/**
 * Bilds a class name string from lists and objects
 *
 * @param names - A list of values to concatenate
 * @example
 * // returns "one three five six"
 * cx("one", "two", false, {three: true, four: false}, ["five", false, "six"])
 */
export default function cx(...names) {
  return []
    .concat(...names)
    .map(n => {
      if (Array.isArray(n)) return cx(n)
      else if (typeof n === 'object' && n !== null)
        return Object.entries(n)
          .filter(([k, v]) => v)
          .map(([k, v]) => k)
          .join(' ')
      else return n
    })
    .filter(n => n && typeof n === 'string')
    .join(' ')
}
