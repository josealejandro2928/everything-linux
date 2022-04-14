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
    selectedFileTypes: Array<string>;
    avoidFiles: Array<string>;
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
/////////////////////////////////////////////////////////////////

////////////////////////TYPES////////////////////////////////

export const SET_DIRECTORY = 'SET_DIRECTORY';
export const SET_SEARCH_FILE = 'SET_SEARCH_FILE';
export const SET_NEW_RESULT = 'SET_NEW_RESULT';
export const SET_RESULTS = 'SET_RESULTS';
export const SET_IS_SERCHING = 'SET_IS_SERCHING';
export const SET_TEXT_SIZE = 'SET_TEXT_SIZE';
export const SET_ORDER = 'SET_ORDER';
export const SET_OPTIONS = 'SET_OPTIONS';

///////////////////////////////////////////////////////////
const loadedDirectory = localStorage.getItem('directory');
const loadedTextSize = localStorage.getItem('textSize');
const loadedOrder = localStorage.getItem('order');
const loadedAvoidFiles = localStorage.getItem('avoidFiles') || '[]';
const loadedHiddenFiles = localStorage.getItem('hiddenFiles');
const loadedLevels = localStorage.getItem('levels');

const initialState: SearchState = {
  directory: loadedDirectory ? JSON.parse(loadedDirectory) : '/',
  searchFile: null,
  result: [],
  isSearching: false,
  options: {
    hiddenFiles: loadedHiddenFiles ? JSON.parse(loadedHiddenFiles) : false,
    levels: loadedLevels ? JSON.parse(loadedLevels) : 0,
    selectedFileTypes: [],
    avoidFiles: JSON.parse(loadedAvoidFiles),
  },
  textSize: loadedTextSize ? JSON.parse(loadedTextSize) : 'xs',
  order: loadedOrder ? JSON.parse(loadedOrder) : '+name',
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
      return { ...state, result: _processingDataFile(payload, state.result, state.order) };
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
    case SET_OPTIONS:
      return { ...state, options: { ...state.options, ...payload } };
    default:
      return state;
  }
};

export default searchReducer;

////////////////////////CUSTOM FUNCTION AND HELPERS ////////////////////////////////
function _sort(
  order:
    | '-name'
    | '+name'
    | '-size'
    | '+size'
    | '+mimetype'
    | '-mimetype'
    | '+lastDateModified'
    | '-lastDateModified',
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

function _processingDataFile(file: IFile | Array<IFile>, data: Array<IFile>, order: string) {
  let newChunks: Array<IFile> = file instanceof Array ? file : [file];
  let newArray = data.concat(newChunks);
  return _sort(order as any, newArray);
  // return newArray;
}

/////////////////////////////////////////////////////////////////////////////////////////
