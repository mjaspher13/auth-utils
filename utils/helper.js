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
export const replaceNullValues = (obj, replacement) => {
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
};

/**
 * Applies the replaceNullValues function to each object in an array.
 *
 * @param {Array} arr - The array of objects to be modified.
 * @param {*} replacement - The value to replace null with.
 * @returns {Array} - The array of modified objects.
 */
export const replaceNullValuesInArray = (arr, replacement) =>
  arr.map((obj) => replaceNullValues(obj, replacement));

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
export const transformObjectKeysToStringArray = (arr) =>
  arr.map((obj) => transformObjectKeysToString(obj));

/**
 * Utility function to filter an array based on the indices provided in a selection object.
 *
 * @param {Array} array - The array to be filtered.
 * @param {Object} selectedIndices - The object with keys as indices and values as true.
 * @returns {Array} - The filtered array containing only the elements at the selected indices.
 */
export const filterArrayByIndices = (array, selectedIndices) =>
  array.filter((item, index) => selectedIndices.hasOwnProperty(index));

/**
 * Checks if any key in an object has a value of true.
 *
 * @param {Object} obj - The object to check.
 * @returns {boolean} - Returns true if any key has a value of true, otherwise false.
 */
export const hasAnyKeyTrue = (obj) => {
  // Loop through each key in the object
  for (let key in obj) {
    // Check if the current key's value is strictly equal to true
    if (obj[key] === true) {
      return true; // Return true immediately if found
    }
  }
  // Return false if no key with true value was found
  return false;
};

/**
 * Returns a set of keys from the input object that have true values.
 *
 * @param {Object} obj - The input object where the keys are integers and the values are booleans.
 * @returns {Set} A set containing the keys that have true values in the input object.
 */
export const getTrueKeys = (obj) => {
  // Create a new set to store the keys with true values
  const trueKeys = new Set();

  // Iterate through the object entries
  for (const [key, value] of Object.entries(obj)) {
    // If the value is true, add the key to the set
    if (value) {
      trueKeys.add(parseInt(key));
    }
  }

  return trueKeys;
};

/**
 * Filters an array based on a filter object.
 * The filter object keys correspond to 0-based indices of the array.
 * If the value for a given key is true, the corresponding array element is included in the result.
 *
 * @param {Array} arr - The array to be filtered.
 * @param {Object} filterObj - The object containing the filter criteria, where keys are 0-based indices and values are booleans.
 * @returns {Array} - A new array containing only the elements for which the filter object has a value of true.
 */
export const filterArrayBySelected = (arr, filterObj) =>
  arr.filter((_, index) => filterObj[index]);

/**
 * Filters an array of objects based on a selection object and retains only the specified keys in the objects.
 *
 * @param {Array} arr - The array of objects to be filtered.
 * @param {Object} filterObj - The object containing the filter criteria, where keys are 0-based indices and values are booleans.
 * @param {Array} keysToRetain - An array of keys to be retained in the filtered objects.
 * @returns {Array} - A new array containing filtered objects with only the specified keys retained.
 */
export const filterAndRetainKeys = (arr, filterObj, keysToRetain) => {
  return arr
    .filter((_, index) => filterObj[index]) // Filter the array based on the selection object
    .map((obj) => {
      // Create a new object with only the specified keys retained
      const newObj = {};
      keysToRetain.forEach((key) => {
        if (obj.hasOwnProperty(key)) {
          newObj[key] = obj[key];
        }
      });
      return newObj;
    });
};

// Constants representing the columns that can be edited
export const EDITABLE_COLUMNS = ["creditLimit", "validFrom", "validTo"];

/**
 * Function to update a specific row's data in the state.
 *
 * @param {number} rowIndex - The index of the row to be updated.
 * @param {string} columnId - The ID of the column to be updated.
 * @param {any} value - The new value to set in the specified column.
 * @param {Object[]} rowSelected - The currently selected rows.
 * @param {Function} setEditCards - The state setter function to update the row data.
 */
const updateMyData = (rowIndex, columnId, value, rowSelected, setEditCards) => {
  // Debugging logs to verify the parameters
  console.log("index", rowIndex);
  console.log("column", columnId);
  console.log("value", value);
  console.log("rowSelection", rowSelected);

  // Update the state with the new value for the specified row and column
  setEditCards((old) =>
    old.map((row, index) => {
      // Check if the current row is the one to be updated
      if (index === rowIndex) {
        // Return the updated row with the new value for the specified column
        return {
          ...old[rowIndex],
          [columnId]: value,
        };
      }
      // Return the original row if it doesn't need to be updated
      return row;
    })
  );
};

/**
 * Formats an expiration date string (MM/DD/YYYY) into a credit card format (MM/YY).
 * Handles invalid or empty inputs gracefully.
 * @param {string} dateString - The full expiration date (e.g., "03/31/2027").
 * @returns {string} The formatted expiration date (e.g., "03/27") or an error message.
 */
export const formatCreditCardExpiration = (dateString) => {
  // Guard clause: Check if input is empty or not a string
  if (!dateString || typeof dateString !== "string") {
    return "Invalid input: dateString must be a non-empty string";
  }

  // Split the date string into components
  const parts = dateString.split("/");

  // Guard clause: Ensure input has the correct format (MM/DD/YYYY)
  if (parts.length !== 3 || parts[0].length !== 2 || parts[2].length !== 4) {
    return "Invalid input: dateString must be in MM/DD/YYYY format";
  }

  const [month, , year] = parts;

  // Guard clause: Check if month and year are valid numbers
  if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
    return "Invalid input: month must be between 01 and 12, and year must be valid";
  }

  // Extract the last two digits of the year
  const shortYear = year.slice(-2);

  // Return formatted string
  return `${month}/${shortYear}`;
};

/**
 * A centralized error code map for validation error handling.
 * Provides clear error messages corresponding to specific validation failures.
 */
export const errorCodeMap = {
  // Credit Limit Errors
  101: "Credit limit is required.",
  102: "Please enter a valid numeric value.",
  103: "Credit limit must be between $1 and $9,999,999.",

  // Valid From Date Errors
  201: "Valid From date is required.",
  202: "Please provide a valid date.",
  203: "Valid From date must be within 30 days from today.",

  // Valid To Date Errors
  301: "Valid To date is required.",
  302: "Please provide a valid date.",
  303: "Valid To date must be after the Valid From date.",
  304: "Valid To date must be within 365 days of the Valid From date.",
};

/**
 * Validates the Credit Limit field.
 * @param {string} value - The input value to validate.
 * @returns {number} - Returns an error code (e.g., 101 for required, 0 for valid).
 */
export const validateCreditLimit = (value) => {
  const numericValue = parseFloat(value.replace(/,/g, ""));

  if (!value || value.trim() === "") {
    return 101; // Credit limit is required
  }
  if (isNaN(numericValue)) {
    return 102; // Invalid numeric value
  }
  if (numericValue < 1 || numericValue > 9999999) {
    return 103; // Out of range
  }

  return 0; // Valid input
};

/**
 * Validates the "Valid From" date field in MM/DD/YYYY format.
 * @param {string} value - The input value to validate.
 * @returns {number} - Returns an error code (e.g., 201 for required, 0 for valid).
 */
export const validateValidFrom = (value) => {
  const currentDate = new Date();

  // Check if the value is empty
  if (!value) {
      return 201; // Valid From is required
  }

  // Check if the value matches the MM/DD/YYYY format
  const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
  if (!dateRegex.test(value)) {
      return 202; // Invalid date format
  }

  // Parse the date and check validity
  const [month, day, year] = value.split('/').map(Number);
  const inputDate = new Date(year, month - 1, day);

  // Ensure the parsed date matches the input
  if (
      inputDate.getMonth() + 1 !== month ||
      inputDate.getDate() !== day ||
      inputDate.getFullYear() !== year
  ) {
      return 202; // Invalid date format
  }

  // Check if the date is within 30 days from today
  const thirtyDaysFromNow = new Date(currentDate);
  thirtyDaysFromNow.setDate(currentDate.getDate() + 30);

  if (inputDate < currentDate || inputDate > thirtyDaysFromNow) {
      return 203; // Out of range
  }

  return 0; // Valid input
};

/**
 * Validates the "Valid To" date field in MM/DD/YYYY format.
 * @param {string} validFromValue - The "Valid From" date to compare against.
 * @param {string} value - The input value to validate.
 * @returns {number} - Returns an error code (e.g., 301 for required, 0 for valid).
 */
export const validateValidTo = (validFromValue, value) => {
  // Check if the value is empty
  if (!value) {
      return 301; // Valid To is required
  }

  // Check if the value matches the MM/DD/YYYY format
  const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
  if (!dateRegex.test(value)) {
      return 302; // Invalid date format
  }

  // Parse the date and check validity
  const [fromMonth, fromDay, fromYear] = validFromValue.split('/').map(Number);
  const [month, day, year] = value.split('/').map(Number);
  const validFromDate = new Date(fromYear, fromMonth - 1, fromDay);
  const inputDate = new Date(year, month - 1, day);

  // Ensure the parsed date matches the input
  if (
      inputDate.getMonth() + 1 !== month ||
      inputDate.getDate() !== day ||
      inputDate.getFullYear() !== year
  ) {
      return 302; // Invalid date format
  }

  // Ensure "Valid To" is after "Valid From"
  if (inputDate <= validFromDate) {
      return 303; // Must be after "Valid From"
  }

  // Ensure "Valid To" is within 365 days of "Valid From"
  const maxValidToDate = new Date(validFromDate);
  maxValidToDate.setDate(validFromDate.getDate() + 365);

  if (inputDate > maxValidToDate) {
      return 304; // Out of range
  }

  return 0; // Valid input
};
