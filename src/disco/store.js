import { createStore as _createStore, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { middleware } from 'core/store';
import addons from 'core/reducers/addons';
import errors from 'core/reducers/errors';
import api from 'core/reducers/api';
import errorPage from 'core/reducers/errorPage';
import infoDialog from 'core/reducers/infoDialog';
import installations from 'core/reducers/installations';
import discoResults from 'disco/reducers/discoResults';


export default function createStore(initialState = {}) {
  const sagaMiddleware = createSagaMiddleware();
  const store = _createStore(
    combineReducers({
      addons,
      api,
      errors,
      discoResults,
      errorPage,
      installations,
      infoDialog,
    }),
    initialState,
    middleware({ sagaMiddleware }),
  );

  return { sagaMiddleware, store };
}
