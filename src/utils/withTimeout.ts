export const withTimeout = <T>(
  promise: PromiseLike<T>,
  ms: number = 8000,
  errorMsg: string = 'Request timeout'
): Promise<T> => {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMsg)), ms)
    )
  ]);
};
