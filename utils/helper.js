/**
 * Creates and returns a debounced version of the passed function.
 * The debounced function delays invoking the provided function until
 * after the specified milliseconds have elapsed since the last time it was invoked.
 * This helps in limiting the rate at which the function is invoked.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The number of milliseconds to delay.
 * @return {Function} - The debounced function.
 */
export const debounce = (func, delay) => {
  let timerId;
  return function (...args) {
    const context = this;
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
};

/**
 * Constructs a full URL by combining a base URL and a relative URL.
 * If the relative URL does not start with a slash, one is prepended.
 *
 * @param {string} url - The relative URL to append to the base URL.
 * @param {string} baseUrl - The base URL.
 * @return {string} - The full URL.
 */
export const extractFullUrl = (url, baseUrl) =>
  `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;

/**
 * Checks if a given value is "empty".
 * "Empty" values are those that are either null, undefined, an empty object,
 * an empty array, or a string made only of whitespace.
 *
 * @param {any} value - The value to check.
 * @return {boolean} - True if the value is empty, false otherwise.
 */
export const isEmpty = (value) => {
  value == null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "string" && value.trim().length === 0);
};
å;
/**
 * Converts an object into a URL query string.
 * If the object contains nested objects or arrays, it will recursively convert them.
 * Each nested level is represented using square brackets in the key names.
 *
 * @param {Object} obj - The object to convert into a query string.
 * @param {string} [parentKey] - The base key name for nested objects (used internally in recursion).
 * @return {string} - The encoded query string.
 */
export const queryString = (obj, parentKey = "") => {
  const pairs = [];
  const encode = encodeURIComponent;

  const buildQueryString = (obj, parentKey = "") => {
    if (obj == null) return;
    Object.entries(obj).forEach(([key, value]) => {
      if (value == null) return;
      const fullKey = parentKey ? `${parentKey}[${encode(key)}]` : encode(key);

      if (typeof value === "object") {
        if (Array.isArray(value)) {
          if (value.length === 0) {
            // Skip empty arrays
            return;
          }
          value.forEach((val, i) => {
            const elementKey =
              Array.isArray(val) || typeof val === "object"
                ? `${fullKey}[${i}]`
                : `${fullKey}[]`;
            buildQueryString(val, elementKey);
          });
        } else {
          buildQueryString(value, fullKey);
        }
      } else {
        pairs.push(`${fullKey}=${encode(value)}`);
      }
    });
  };

  buildQueryString(obj, parentKey);
  return pairs.join("&");
};
/**
 * Remove non-numeric and non-decimal characters from a string.
 *
 * @param {string} inputStr - The string to clean.
 * @return {string} - A string containing only numbers and decimal points.
 */
export const cleanCurrency = (inputStr) => {
  return inputStr.replace(/[^\d.]/g, "");
};

/**
 * Replaces null values in an object with a specified value.
 *
 * @param {Object} obj - The object to be modified.
 * @param {*} replacement - The value to replace null with.
 * @returns {Object} - The modified object.
 */
function replaceNullValues(obj, replacement) {
  // Create a new object to avoid mutating the original object
  let newObj = {};

  // Iterate over the object properties
  for (let key in obj) {
    // Check if the current value is null
    if (obj[key] === null) {
      newObj[key] = replacement;
    } else {
      newObj[key] = obj[key];
    }
  }

  return newObj;
}

/**
 * Applies the replaceNullValues function to each object in an array.
 *
 * @param {Array} arr - The array of objects to be modified.
 * @param {*} replacement - The value to replace null with.
 * @returns {Array} - The array of modified objects.
 */
function replaceNullValuesInArray(arr, replacement) {
  return arr.map((obj) => replaceNullValues(obj, replacement));
}

/**
 * Converts object keys to strings.
 *
 * @param {Object} obj - The object to be modified.
 * @returns {Object} - The modified object with keys as strings.
 */
export const transformObjectKeysToString = (obj) => {
  // Create a new object to avoid mutating the original object
  let newObj = {};

  // Iterate over the object properties
  for (let key in obj) {
    // Convert key to string
    let stringKey = String(key);

    // Copy the value to the new object
    newObj[stringKey] = obj[key];
  }

  return newObj;
};

/**
 * Applies the transformObjectKeysToString function to each object in an array.
 *
 * @param {Array} arr - The array of objects to be modified.
 * @returns {Array} - The array of modified objects with keys as strings.
 */
export const transformObjectKeysToStringArray = (arr) => {
  return arr.map((obj) => transformObjectKeysToString(obj));
};

/**
 * Utility function to filter an array based on the indices provided in a selection object.
 *
 * @param {Array} array - The array to be filtered.
 * @param {Object} selectedIndices - The object with keys as indices and values as true.
 * @returns {Array} - The filtered array containing only the elements at the selected indices.
 */
const filterArrayByIndices = (array, selectedIndices) => {
  return array.filter((item, index) => selectedIndices.hasOwnProperty(index));
};
