////////////////////////// INTERFACES ////////////////////////
export interface SettingState {
  selectedFileTypes: Array<string>;
  avoidFiles: Array<string>;
}
/////////////////////////////////////////////////////////////////

////////////////////////TYPES////////////////////////////////
export const SET_SELECTED_FILE_TYPES = 'SET_SELECTED_FILE_TYPES';
export const SET_AVOID_FILES = 'SET_AVOID_FILES';

///////////////////////////////////////////////////////////
const loadedAvoidFiles = localStorage.getItem('avoidFiles') || '[]';

const initialState: SettingState = {
  selectedFileTypes: [],
  avoidFiles: JSON.parse(loadedAvoidFiles),
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
    default:
      return state;
  }
};

export default settingsReducer;

////////////////////////CUSTOM FUNCTION AND HELPERS ////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////
