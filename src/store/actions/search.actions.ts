import { IFile } from '../../models/file.model';
import {
  SET_SEARCH_FILE,
  SET_DIRECTORY,
  SET_IS_SERCHING,
  SET_NEW_RESULT,
  SET_RESULTS,
  SET_TEXT_SIZE,
  SET_ORDER,
  SET_OPTIONS,
} from '../reducers/search.reducer';

export const setSearchFile = (searchStr: string) => async (dispatch: Function) => {
  return dispatch({
    type: SET_SEARCH_FILE,
    payload: searchStr,
  });
};

export const setSearchDirectory = (directory: string) => async (dispatch: Function) => {
  return dispatch({
    type: SET_DIRECTORY,
    payload: directory,
  });
};

export const setIsSearching = (state: boolean) => async (dispatch: Function) => {
  return dispatch({
    type: SET_IS_SERCHING,
    payload: state,
  });
};

export const setNewResult = (data: IFile | Array<File>) => async (dispatch: Function) => {
  return dispatch({
    type: SET_NEW_RESULT,
    payload: data,
  });
};

export const setResults = (data: Array<IFile>) => async (dispatch: Function) => {
  return dispatch({
    type: SET_RESULTS,
    payload: data,
  });
};

export const setTextSize =
  (data: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => async (dispatch: Function) => {
    return dispatch({
      type: SET_TEXT_SIZE,
      payload: data,
    });
  };

export const setOrder =
  (data: '-name' | '+name' | '-size' | '+size' | '+type' | '-type') =>
  async (dispatch: Function) => {
    return dispatch({
      type: SET_ORDER,
      payload: data,
    });
  };

export const setOptions =
  (options: {
    hiddenFiles?: boolean;
    levels?: number | null | undefined;
    selectedFileTypes?: Array<string>;
    avoidFiles?: Array<string>;
    matchCase?: boolean;
    matchExaclyWord?: boolean;
    regularExpression?: boolean;
  }) =>
  async (dispatch: Function) => {
    return dispatch({
      type: SET_OPTIONS,
      payload: options,
    });
  };
