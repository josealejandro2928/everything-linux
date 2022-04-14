import { SET_SELECTED_FILE_TYPES, SET_AVOID_FILES } from '../reducers/setting.reducer';

export const setSelectdFileTypes = (data: Array<string>) => async (dispatch: Function) => {
  return dispatch({
    type: SET_SELECTED_FILE_TYPES,
    payload: data,
  });
};

export const setAvoidFiles = (data: Array<string>) => async (dispatch: Function) => {
  return dispatch({
    type: SET_AVOID_FILES,
    payload: data,
  });
};
