import { isEmpty } from "./helpers";

/**
 * Stores a value associated with a key in localStorage if the key is not empty.
 * @param {string} key - The key under which the value is stored.
 * @param {any} value - The value to store.
 */
export const setLocalStorage = (key, value) => {
  if (isEmpty(key)) return;
  localStorage.setItem(key, value);
};

/**
 * Retrieves a value from localStorage by key. Returns a default value if the key is not found or is empty.
 * @param {string} key - The key to retrieve.
 * @param {any} defaultValue - The default value to return if the key is not found.
 * @return {any} - The value retrieved from localStorage or the default value.
 */
export const getLocalStorage = (key, defaultValue = undefined) => {
  if (isEmpty(key)) return;
  const value = localStorage.getItem(key);
  if (!value) return defaultValue;
  return JSON.parse(value);
};

/**
 * Removes a key and its associated value from localStorage.
 * @param {string} key - The key to remove.
 */
export const deleteLocalStorage = (key) => {
  if (isEmpty(key)) return;
  localStorage.removeItem(key);
};

/**
 * Clears all entries from localStorage.
 */
export const clearLocalStorage = () => {
  localStorage.clear();
};

/**
 * Clears all entries from localStorage except for the specified keys.
 * @param {string[]} exceptKeys - The keys to exclude from being cleared.
 */
export const clearLocalStorageExcept = (exceptKeys) => {
  const exceptValues = exceptKeys.reduce((acc, key) => {
    const value = localStorage.getItem(key);
    if (value !== null) acc[key] = value;
    return acc;
  }, {});

  localStorage.clear();

  Object.entries(exceptValues).forEach(([key, value]) => {
    localStorage.setItem(key, value);
  });
};

/**
 * Creates a storage interface for a specific key using localStorage.
 * @param {string} key - The key associated with the storage operations.
 * @param {any} defaultValue - Default value to use when no value is retrieved.
 * @return {Object} - An object with set, get, delete, and clear methods.
 */
export const localStorageBuilder = (key, defaultValue = undefined) => {
  return {
    set: (value) => setLocalStorage(key, value),
    get: (dv) => getLocalStorage(key, dv === undefined ? dv : defaultValue),
    delete: () => deleteLocalStorage(key),
    clearLocalStorage: () => clearLocalStorage(),
  };
};

/**
 * Stores a value associated with a key in sessionStorage if the key is not empty.
 * Values are stored as JSON strings.
 * @param {string} key - The key under which the value is stored.
 * @param {any} value - The value to store.
 */
export const setSessionStorage = (key, value) => {
  if (isEmpty(key)) return;
  const v = value ? JSON.stringify(value) : value;
  sessionStorage.setItem(key, v);
};

/**
 * Retrieves a value from sessionStorage by key. Returns a default value if the key is not found or is empty.
 * @param {string} key - The key to retrieve.
 * @param {any} defaultValue - The default value to return if the key is not found.
 * @return {any} - The value retrieved from sessionStorage or the default value.
 */
export const getSessionStorage = (key, defaultValue = undefined) => {
  if (isEmpty(key)) return;
  const value = sessionStorage.getItem(key);
  if (!value) return defaultValue;
  return JSON.parse(value);
};

/**
 * Clears all entries from sessionStorage.
 */
export const clearSessionStorage = () => {
  sessionStorage.clear();
};

/**
 * Creates a storage interface for a specific key using sessionStorage.
 * Values are stored and retrieved as JSON strings.
 * @param {string} key - The key associated with the storage operations.
 * @param {any} defaultValue - Default value to use when no value is retrieved.
 * @return {Object} - An object with set, get, delete, and clear methods.
 */
export const SessionStorageBuilder = (key, defaultValue = undefined) => {
  return {
    set: (value) => {
      if (isEmpty(key)) return;
      const v = value ? JSON.stringify(value) : value;
      sessionStorage.setItem(key, v);
    },
    get: () => {
      if (isEmpty(key)) return;
      const value = sessionStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    },
    delete: () => {
      if (isEmpty(key)) return;
      sessionStorage.removeItem(key);
    },
    clear: () => {
      clearSessionStorage();
    },
  };
};

/**
 * Serializes and saves a state object under a specific key in localStorage.
 * @param {string} key - The key under which to store the serialized state.
 * @param {Object} state - The state object to serialize and store.
 */
export const saveState = (key, state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch (err) {
    console.error("Could not save state for key:", key, err);
  }
};

/**
 * Loads and deserializes a state object stored under a specific key in localStorage.
 * Returns undefined if no data is found.
 * @param {string} key - The key from which to load the state.
 * @return {Object|undefined} - The deserialized state object or undefined if not found.
 */
export const loadState = (key) => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

/**
 * Clears all data from both localStorage and sessionStorage.
 * This function is useful for ensuring that all user data is removed when they log out,
 * or when you need to reset the application's stored state completely.
 */
export const clearAllStorage = () => {
  // Clear all local storage data
  localStorage.clear();
  // Clear all session storage data
  sessionStorage.clear();
};

/**
 * Sets up a proxy on the global sessionStorage object to intercept and handle all get, set, delete,
 * and clear operations. This enables the application to react to changes in sessionStorage across
 * different components by dispatching custom events whenever these operations occur.
 */
// File: setupSessionStorageProxy.js
export function setupSessionStorageProxy() {
  // Back up the original sessionStorage methods
  const originalGetItem = sessionStorage.getItem;
  const originalSetItem = sessionStorage.setItem;
  const originalRemoveItem = sessionStorage.removeItem;
  const originalClear = sessionStorage.clear;

  // Override getItem
  sessionStorage.getItem = function (key) {
    console.log(`Getting item: ${key}`);
    return originalGetItem.apply(this, arguments);
  };

  // Override setItem
  sessionStorage.setItem = function (key, value) {
    console.log(`Setting item: ${key} to ${value}`);
    document.dispatchEvent(
      new CustomEvent("sessionStorageChanged", {
        detail: { type: "set", key, value },
      })
    );
    return originalSetItem.apply(this, arguments);
  };

  // Override removeItem
  sessionStorage.removeItem = function (key) {
    console.log(`Removing item: ${key}`);
    document.dispatchEvent(
      new CustomEvent("sessionStorageChanged", {
        detail: { type: "delete", key },
      })
    );
    return originalRemoveItem.apply(this, arguments);
  };

  // Override clear
  sessionStorage.clear = function () {
    console.log(`Clearing all sessionStorage`);
    document.dispatchEvent(
      new CustomEvent("sessionStorageChanged", { detail: { type: "clear" } })
    );
    return originalClear.apply(this);
  };
}

export const languageListStorage = SessionStorageBuilder("languageList");
export const loginStatusStorage = SessionStorageBuilder("LOGIN_STATUS");
export const previousPageLoadsStorage = SessionStorageBuilder(
  "previous_page_loads"
);
export const selectedLanguageStorage =
  SessionStorageBuilder("selected_Language");
export const userIdentityStorage = SessionStorageBuilder("cadre-user-identity");
export const pendoTabIdStorage = SessionStorageBuilder("pendo_tabId");
export const appLabelsStorage = SessionStorageBuilder("app_labels");
