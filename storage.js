import { isEmpty } from "./helpers";

export const setLocalStorage = (key, value) => {
  if (isEmpty(key)) return;
  localStorage.setItem(key, value);
};

export const getLocalStorage = (key, defaultValue = undefined) => {
  if (isEmpty(key)) return;
  const value = localStorage.getItem(key);
  if (!value) return defaultValue;
  return JSON.parse(value);
};

export const deleteLocalStorage = (key) => {
  if (isEmpty(key)) return;
  localStorage.removeItem(key);
};

export const clearLocalStorage = () => {
  localStorage.clear();
};

export const localStorageBuilder = (key, defaultValue = undefined) => {
  return {
    set: (value) => setLocalStorage(key, value),
    get: (dv) => getLocalStorage(key, dv === undefined ? dv : defaultValue),
    delete: () => deleteLocalStorage(key),
    clearLocalStorage: () => clearLocalStorage(),
  };
};

export const setSessionStorage = (key, value) => {
  if (isEmpty(key)) return;
  const v = value ? JSON.stringify(value) : value;
  sessionStorage.setItem(key, v);
};

export const getSessionStorage = (key, defaultValue = undefined) => {
  if (isEmpty(key)) return;
  const value = sessionStorage.getItem(key);
  if (!value) return defaultValue;
  return JSON.parse(value);
};

export const clearSessionStorage = () => {
  sesionStorage.clear();
};

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

export const languageListStorage = SessionStorageBuilder('languageList');
export const loginStatusStorage = SessionStorageBuilder('LOGIN_STATUS');
export const previousPageLoadsStorage = SessionStorageBuilder('previous_page_loads');
export const selectedLanguageStorage = SessionStorageBuilder('selected_Language');
export const userIdentityStorage = SessionStorageBuilder('cadre-user-identity');
export const pendoTabIdStorage = SessionStorageBuilder('pendo_tabId');
export const appLabelsStorage = SessionStorageBuilder('app_labels');
