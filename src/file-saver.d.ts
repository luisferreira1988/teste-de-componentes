// types/file-saver.d.ts
declare module 'file-saver' {
  interface FileSaverOptions {
    autoBom?: boolean;
  }

  function saveAs(
    data: Blob | File,
    filename?: string,
    options?: FileSaverOptions
  ): void;
  export { saveAs };
}
