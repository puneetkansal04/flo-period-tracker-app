import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import periodReducer from './slices/periodSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['isSessionUnlocked'], // We only have one slice anyway
};

const persistedReducer = persistReducer(persistConfig, periodReducer);

export const store = configureStore({
  reducer: {
    period: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
