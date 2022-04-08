import { SET_SEARCH_FILE, SET_DIRECTORY } from '../reducers/search.reducer';

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
