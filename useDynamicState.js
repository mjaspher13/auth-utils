import { useSelector } from 'react-redux';

/**
 * Custom hook to dynamically select a part of the Redux state.
 * @param {string} stateKey - The key of the state to select.
 * @param {function} selectorFn - Optional function to extract specific data from the state.
 * @returns {*} - The selected state.
 */
const useDynamicState = (stateKey, selectorFn = (state) => state[stateKey]) => {
  return useSelector(selectorFn);
};

export default useDynamicState;
