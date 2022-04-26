import { IFile } from '../../models/file.model';

export interface SearchState {
  directory: string;
  searchFile: string | null | undefined;
  result: Array<IFile>;
  isSearching: boolean;
  options: {
    hiddenFiles: boolean;
    levels: number | null | undefined;
    selectedFileTypes: Array<string>;
    avoidFiles: Array<string>;
    multicores: boolean;
    matchCase?: boolean;
    matchExaclyWord?: boolean;
    regularExpression?: boolean;
  };
  textSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  order:
    | '-name'
    | '+name'
    | '-size'
    | '+size'
    | '+mimetype'
    | '-mimetype'
    | '+lastDateModified'
    | '-lastDateModified';
}

export interface SettingState {
  selectedFileTypes: Array<string>;
  avoidFiles: Array<string>;
  hiddenFiles: boolean;
  levels: number | null;
  showHighLight: boolean;
  multicores: boolean;
}

export interface State {
  search: SearchState;
  settings: SettingState;
}
