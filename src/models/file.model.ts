export interface IFile {
  name: string;
  path: string;
  isDirectory: string;
  size: string | number;
  mimetype: string;
  lastDateModified: Date | string;
  id: any;
  sizeLabel: string;
  icon: string;
  mtime: Date;
}

export interface IRequestSearch {
  directories: string | Array<string> | null | undefined;
  searchParam: string | null;
  options?: {
    hiddenFiles: boolean;
    levels: number | null | undefined;
  };
}
