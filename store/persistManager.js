import { isEmpty } from "../utils/helpers";
import { loadState, saveState } from "../utils/storage";

const stateKeys = {
    login: 'login',
    userProfile: 'userProfile',
    settings: 'settings'
};

export const loadPersistedState = () => {
    let initialState = {};
    Object.keys(stateKeys).forEach(key => {
        const savedState = loadState(stateKeys[key]);
        if (!isEmpty(savedState)) {
            initialState[key] = savedState;
        }
    });
    return initialState;
};

export const savePersistedState = (state) => {
    Object.keys(stateKeys).forEach(key => {
        saveState(stateKeys[key], state[key]);
    });
};
