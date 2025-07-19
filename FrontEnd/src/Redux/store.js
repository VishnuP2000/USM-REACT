
// store.js
import { configureStore } from "@reduxjs/toolkit";
import UmsStore from '../Redux/Redux'; // this is your userSlice
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import { combineReducers } from 'redux';

console.log('it is store of redux')
// combine reducers (even if only one, for scalability)
const rootReducer = combineReducers({
  ums: UmsStore,
});

// redux-persist config
const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // important for redux-persist
    }),
});

export const persistor = persistStore(store);
