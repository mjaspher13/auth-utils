import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import { loadPersistedState, savePersistedState } from "./persistManager";

const preloadedState = loadPersistedState();

const store = configureStore({
  reducer: rootReducer,
  preloadedState,
});

store.subscribe(() => {
  savePersistedState(store.getState());
});

export default store;
