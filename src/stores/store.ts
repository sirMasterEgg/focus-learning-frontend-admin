import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import authSlices, { IAuthState } from "@/stores/slices/auth.slices.ts";
import { encryptTransform } from "redux-persist-transform-encrypt";

type Reducers = {
  auth: IAuthState;
};

const reducers = combineReducers({
  auth: authSlices,
});

const persistConfig = {
  key: "root",
  storage,
  transforms: [
    encryptTransform({
      secretKey: import.meta.env.VITE_ENCRYPT_KEY as string,
      onError: function (error) {
        console.log(error);
      },
    }),
  ],
  whitelist: ["auth"],
};

const persistedReducer = persistReducer<Reducers>(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
