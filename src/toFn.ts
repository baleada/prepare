export function toFn<Fn extends Function> (fn: Fn): Fn {
  // @ts-expect-error
  return typeof fn === 'function' ? fn : fn.default
}
