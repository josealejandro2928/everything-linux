////////////////////////// INTERFACES ////////////////////////
export interface SettingState {
  selectedFileTypes: Array<string>;
  avoidFiles: Array<string>;
  hiddenFiles: boolean;
  levels: number | null;
  showHighLight: boolean;
  multicores: boolean;
}
/////////////////////////////////////////////////////////////////

////////////////////////TYPES////////////////////////////////
export const SET_SELECTED_FILE_TYPES = 'SET_SELECTED_FILE_TYPES';
export const SET_AVOID_FILES = 'SET_AVOID_FILES';
export const SET_HIDDEN_FILES = 'SET_HIDDEN_FILES';
export const SET_LEVELS = 'SET_LEVELS';
export const SET_HIGH_LIGHT = 'SET_HIGH_LIGHT';
export const SET_MULTICORES = 'SET_MULTICORES';

///////////////////////////////////////////////////////////
const loadedAvoidFiles = localStorage.getItem('avoidFiles') || '["node_modules","env"]';
const loadedHiddenFiles = localStorage.getItem('hiddenFiles');
const loadedLevels = localStorage.getItem('levels');
const showHighLight = localStorage.getItem('showHighLight');
const multicores = localStorage.getItem('multicores');

const initialState: SettingState = {
  selectedFileTypes: [],
  avoidFiles: JSON.parse(loadedAvoidFiles),
  hiddenFiles: loadedHiddenFiles ? JSON.parse(loadedHiddenFiles) : false,
  levels: loadedLevels ? JSON.parse(loadedLevels) : 0,
  showHighLight: showHighLight ? JSON.parse(showHighLight) : true,
  multicores: multicores ? JSON.parse(multicores) : false,
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
    case SET_HIGH_LIGHT:
      return { ...state, showHighLight: payload };
    case SET_MULTICORES:
      return { ...state, multicores: payload };
    default:
      return state;
  }
};

export default settingsReducer;

////////////////////////CUSTOM FUNCTION AND HELPERS ////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////
