declare module '../.open-next/worker' {
  const worker: ExportedHandler<CloudflareEnv>;
  export default worker;
}
