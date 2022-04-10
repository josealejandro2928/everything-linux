import { IFile } from '../../models/file.model';

////////////////////////// INTERFACES ////////////////////////
export interface SearchState {
  directory: string;
  searchFile: string | null | undefined;
  result: Array<IFile>;
  isSearching: boolean;
  options: {
    hiddenFiles: boolean;
    levels: number | null | undefined;
  };
  textSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}
/////////////////////////////////////////////////////////////////

////////////////////////TYPES////////////////////////////////

export const SET_DIRECTORY = 'SET_DIRECTORY';
export const SET_SEARCH_FILE = 'SET_SEARCH_FILE';
export const SET_NEW_RESULT = 'SET_NEW_RESULT';
export const SET_RESULTS = 'SET_RESULTS';
export const SET_IS_SERCHING = 'SET_IS_SERCHING';
export const SET_TEXT_SIZE = 'SET_TEXT_SIZE';

///////////////////////////////////////////////////////////

const initialState: SearchState = {
  directory: '/',
  searchFile: null,
  result: [],
  isSearching: false,
  options: {
    hiddenFiles: false,
    levels: null,
  },
  textSize: 'sm',
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
      let newArray = state.result.filter((e) => e.name != payload.name);
      newArray.push(payload);
      return { ...state, result: newArray };
    case SET_RESULTS:
      return { ...state, result: payload };
    case SET_IS_SERCHING:
      return { ...state, isSearching: payload };
    case SET_TEXT_SIZE:
      const data = payload as 'xs' | 'sm' | 'md' | 'lg' | 'xl';
      return { ...state, textSize: data };
    default:
      return state;
  }
};

export default searchReducer;
