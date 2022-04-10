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
  order: '-name' | '+name' | '-size' | '+size' | '+mimetype' | '-mimetype';
}
/////////////////////////////////////////////////////////////////

////////////////////////TYPES////////////////////////////////

export const SET_DIRECTORY = 'SET_DIRECTORY';
export const SET_SEARCH_FILE = 'SET_SEARCH_FILE';
export const SET_NEW_RESULT = 'SET_NEW_RESULT';
export const SET_RESULTS = 'SET_RESULTS';
export const SET_IS_SERCHING = 'SET_IS_SERCHING';
export const SET_TEXT_SIZE = 'SET_TEXT_SIZE';
export const SET_ORDER = 'SET_ORDER';

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
  textSize: 'xs',
  order: '+name',
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
      return { ...state, result: _processingSingleFile(payload, state.result, state.order) };
    case SET_RESULTS:
      return { ...state, result: payload };
    case SET_IS_SERCHING:
      return { ...state, isSearching: payload };
    case SET_TEXT_SIZE:
      const data = payload as 'xs' | 'sm' | 'md' | 'lg' | 'xl';
      return { ...state, textSize: data };
    case SET_ORDER:
      const order = payload;
      return { ...state, order: order, result: _sort(order, state.result) };
    default:
      return state;
  }
};

export default searchReducer;

////////////////////////CUSTOM FUNCTION AND HELPERS ////////////////////////////////
function _sort(
  order: '-name' | '+name' | '-size' | '+size' | '+mimetype' | '-mimetype',
  data: Array<any>
) {
  const sense = order.slice(0, 1);
  const key = order.slice(1);
  return data.sort((a, b) => {
    if (sense == '+') {
      if (a[key] > b[key]) return 1;
      if (a[key] < b[key]) return -1;
      return 0;
    } else {
      if (a[key] > b[key]) return -1;
      if (a[key] < b[key]) return 1;
      return 0;
    }
  });
}

function _processingSingleFile(file: IFile, data: Array<IFile>, order: string) {
  let newArray = data.filter((e) => e.name != file.name);
  newArray.push(file);
  return _sort(order as any, newArray);
}

/////////////////////////////////////////////////////////////////////////////////////////
