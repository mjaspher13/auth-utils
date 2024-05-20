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
 * Checks if a given value is "empty".
 * "Empty" values are those that are either null, undefined, an empty object,
 * an empty array, or a string made only of whitespace.
 *
 * @param {any} value - The value to check.
 * @return {boolean} - True if the value is empty, false otherwise.
 */
export const isEmpty = (value) => {
  return (
    value == null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
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

  Object.entries(obj).forEach(([key, value]) => {
    if (value == null) return;
    const fullKey = parentKey ? `${parentKey}[${encode(key)}]` : encode(key);

    if (typeof value === "object") {
      if (Array.isArray(value)) {
        value.forEach((val, i) => {
          const elementKey =
            Array.isArray(val) || typeof val === "object"
              ? `${fullKey}[${i}]`
              : `${fullKey}[]`;
          pairs.push(...queryString(val, elementKey));
        });
      } else {
        pairs.push(...queryString(value, fullKey));
      }
    } else {
      pairs.push(`${fullKey}=${encode(value)}`);
    }
  });

  return pairs.join("&");
};