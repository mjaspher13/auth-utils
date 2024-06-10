import { useState, useCallback } from 'react';
import { validateSchema } from './zod';
import { NumberValidator } from './zod';

/**
 * Custom hook for form state management and validation.
 * @param {Object} schema - Validation schema.
 * @returns {Object} - Form utilities.
 */
const useForm = (schema) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  const validateField = useCallback((name, value) => {
    if (typeof schema[name] === 'function') {
      try {
        schema[name](value).validate();
        return null;
      } catch (error) {
        return error.message;
      }
    } else {
      console.error(`No validation function for field: ${name}`);
      return `No validation function for field: ${name}`;
    }
  }, [schema]);

  const handleChange = useCallback((name, value) => {
    let parsedValue = value;

    // Check if the schema expects a number and parse the value accordingly
    if (schema[name] && schema[name]().constructor === NumberValidator) {
      parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) {
        parsedValue = undefined;
      }
    }

    setValues((prevValues) => ({ ...prevValues, [name]: parsedValue }));
    const error = validateField(name, parsedValue);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  }, [validateField, schema]);

  const handleStatusUpdate = useCallback((name, status) => {
    const { rawValue } = status;
    handleChange(name, rawValue);
  }, [handleChange]);

  const handleSubmit = (callback) => (event) => {
    event.preventDefault();
    try {
      const validatedData = validateSchema(schema, values);
      callback(validatedData);
    } catch (error) {
      setErrors(error.errors);
    }
  };

  const isFormValid = () => {
    for (const key in schema) {
      if (schema.hasOwnProperty(key)) {
        if (validateField(key, values[key])) {
          return false;
        }
      }
    }
    return true;
  };

  return { handleStatusUpdate, handleSubmit, values, errors, isFormValid };
};

export default useForm;
