import { IFile } from '../../models/file.model';

////////////////////////// INTERFACES ////////////////////////
export interface SearchState {
  directory: string;
  searchFile: string | null | undefined;
  result: Array<IFile>;
}
/////////////////////////////////////////////////////////////////

////////////////////////TYPES////////////////////////////////

export const SET_DIRECTORY = 'SET_DIRECTORY';
export const SET_SEARCH_FILE = 'SET_SEARCH_FILE';
export const SET_NEW_RESULT = 'SET_NEW_RESULT';
export const SET_RESULTS = 'SET_RESULTS';

///////////////////////////////////////////////////////////

const initialState: SearchState = {
  directory: '/',
  searchFile: null,
  result: [],
};

const searchReducer = (
  state: SearchState = initialState,
  action: { type: string; payload?: any }
): SearchState => {
  const { type, payload } = action;
  switch (type) {
    case SET_DIRECTORY:
      return { ...state, directory: payload };
    case SET_SEARCH_FILE:
      return { ...state, searchFile: payload };
    case SET_NEW_RESULT:
      return { ...state, result: [...state.result, payload] };
    case SET_RESULTS:
      return { ...state, result: payload };
    default:
      return state;
  }
};

export default searchReducer;
