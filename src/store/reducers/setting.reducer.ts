////////////////////////// INTERFACES ////////////////////////
export interface SettingState {
  selectedFileTypes: Array<string>;
  avoidFiles: Array<string>;
  hiddenFiles: boolean;
  levels: number | null;
}
/////////////////////////////////////////////////////////////////

////////////////////////TYPES////////////////////////////////
export const SET_SELECTED_FILE_TYPES = 'SET_SELECTED_FILE_TYPES';
export const SET_AVOID_FILES = 'SET_AVOID_FILES';
export const SET_HIDDEN_FILES = 'SET_HIDDEN_FILES';
export const SET_LEVELS = 'SET_LEVELS';

///////////////////////////////////////////////////////////
const loadedAvoidFiles = localStorage.getItem('avoidFiles') || '[]';
const loadedHiddenFiles = localStorage.getItem('hiddenFiles');
const loadedLevels = localStorage.getItem('levels');

const initialState: SettingState = {
  selectedFileTypes: [],
  avoidFiles: JSON.parse(loadedAvoidFiles),
  hiddenFiles: loadedHiddenFiles ? JSON.parse(loadedHiddenFiles) : false,
  levels: loadedLevels ? JSON.parse(loadedLevels) : 0,
};

const settingsReducer = (
  state: SettingState = initialState,
  action: { type: string; payload?: any }
): SettingState => {
  const { type, payload } = action;
  switch (type) {
    case SET_SELECTED_FILE_TYPES:
      return { ...state, selectedFileTypes: payload };
    case SET_AVOID_FILES:
      return { ...state, avoidFiles: payload };
    case SET_HIDDEN_FILES:
      return { ...state, hiddenFiles: payload };
    case SET_LEVELS:
      return { ...state, levels: payload };
    default:
      return state;
  }
};

export default settingsReducer;

////////////////////////CUSTOM FUNCTION AND HELPERS ////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////
