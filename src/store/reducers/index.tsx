import { combineReducers } from 'redux';

import searchReducer, { SearchState } from './search.reducer';

export interface State {
  search: SearchState;
}

const rootReducer = combineReducers<State>({
  search: searchReducer,
});

export default rootReducer;
