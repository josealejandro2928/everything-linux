import { combineReducers } from 'redux';

import searchReducer, { SearchState } from './search.reducer';
import settingsReducer, { SettingState } from './setting.reducer';

export interface State {
  search: SearchState;
  settings: SettingState
}

const rootReducer = combineReducers<State>({
  search: searchReducer,
  settings: settingsReducer
});

export default rootReducer;
