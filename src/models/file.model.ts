export interface IFile {
  name: string;
  path: string;
  isDirectory: string;
  size: string;
  mimetype: string;
}

export interface IRequestSearch {
  directories: string | Array<string> | null | undefined;
  searchParam: string | null;
  options?: {
    hiddenFiles: boolean;
    levels: number | null | undefined;
  };
}
