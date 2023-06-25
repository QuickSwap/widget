import { configureStore } from '@reduxjs/toolkit';
import { save, load } from 'redux-localstorage-simple';

import application from 'state/application/reducer';
import { updateVersion } from './global/actions';
import user from './user/reducer';
import transactions from './transactions/reducer';
import swap from './swap/reducer';
import lists from './lists/reducer';
import multicall from './multicall/reducer';
import multicallV3 from './multicall/v3/reducer';
import swapV3 from './swap/v3/reducer';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { api as dataApi } from './data/slice';

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists'];

const store = configureStore({
  reducer: {
    application,
    user,
    transactions,
    swap,
    swapV3,
    multicall,
    multicallV3,
    lists,
    [dataApi.reducerPath]: dataApi.reducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({ serializableCheck: false, thunk: true }).concat(
      dataApi.middleware,
    ),
    save({ states: PERSISTED_KEYS }),
  ],
  preloadedState: load({ states: PERSISTED_KEYS }),
});

store.dispatch(updateVersion());

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
