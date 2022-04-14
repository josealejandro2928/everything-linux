import {
  SET_SELECTED_FILE_TYPES,
  SET_AVOID_FILES,
  SET_HIDDEN_FILES,
  SET_LEVELS,
} from '../reducers/setting.reducer';

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

export const setHiddenFiles = (data: boolean) => async (dispatch: Function) => {
  return dispatch({
    type: SET_HIDDEN_FILES,
    payload: data,
  });
};

export const setLevels = (levels: number | null) => async (dispatch: Function) => {
  return dispatch({
    type: SET_LEVELS,
    payload: levels,
  });
};
