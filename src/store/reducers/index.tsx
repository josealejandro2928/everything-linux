import { combineReducers } from 'redux';
import { State } from '../models/index.state';
import searchReducer from './search.reducer';
import settingsReducer from './setting.reducer';


const rootReducer = combineReducers<State>({
  search: searchReducer,
  settings: settingsReducer
});

export default rootReducer;
