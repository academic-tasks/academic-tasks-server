declare module 'inclusion' {
  const inclusion: <T>(mod: string) => Promise<T>;
  export default inclusion;
}
