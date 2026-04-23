import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import courseReducer from "./slices/courseSlice";

const persistConfig = {
  key: "root",
  version: 2, // Bumped version to clear old non-serializable state from localStorage
  storage,
  whitelist: ["auth", "course"], 
};

const rootReducer = combineReducers({
  auth: authReducer,
  course: courseReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Ignore specific paths that might still contain Firebase non-serializable objects
        // although we are sanitizing them, this provides a fallback for the middleware
        ignoredPaths: ["auth.user.createdAt", "auth.user.updatedAt", "course.courses"],
      },
    }),
});

export const persistor = persistStore(store);
