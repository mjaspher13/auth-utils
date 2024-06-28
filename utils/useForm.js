import { useState, useCallback } from 'react';
import { validateSchema, NumberValidator } from './zod';

/**
 * Custom hook for form state management and validation.
 * @param {Object} schema - Validation schema.
 * @returns {Object} - Form utilities.
 */
const useForm = (schema) => {
  const [values, setValues] = useState(() => {
    const initialValues = {};
    for (const key in schema) {
      if (Object.prototype.hasOwnProperty.call(schema, key)) {
        const validator = schema[key]();
        if (validator.defaultValue !== undefined) {
          initialValues[key] = validator.defaultValue;
        }
      }
    }
    return initialValues;
  });
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

  const handleChange = useCallback((name, inputValue) => {
    let parsedValue = inputValue;

    // Check if the schema expects a number and parse the value accordingly
    if (schema[name] && schema[name](parsedValue) instanceof NumberValidator) {
      parsedValue = parseFloat(inputValue);
      if (isNaN(parsedValue)) {
        parsedValue = undefined;
      }
    }

    setValues((prevValues) => ({ ...prevValues, [name]: parsedValue }));
    const error = validateField(name, parsedValue);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  }, [validateField, schema]);

  const handleStatusUpdate = useCallback((name, status) => {
    const { inputValue } = status;
    handleChange(name, inputValue);
  }, [handleChange]);

  const handleSubmit = (callback) => (event) => {
    event.preventDefault();
    let isValid = true;
    const validationErrors = {};

    for (const key in schema) {
      if (Object.prototype.hasOwnProperty.call(schema, key)) {
        const error = validateField(key, values[key]);
        if (error) {
          isValid = false;
          validationErrors[key] = error;
        }
      }
    }

    if (isValid) {
      try {
        const validatedData = validateSchema(schema, values);
        callback(validatedData);
      } catch (error) {
        setErrors(error.errors);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const isFormValid = () => {
    for (const key in schema) {
      if (Object.prototype.hasOwnProperty.call(schema, key)) {
        const error = validateField(key, values[key]);
        if (error) {
          return false;
        }
      }
    }
    return true;
  };

  return { handleChange, handleStatusUpdate, handleSubmit, values, errors, isFormValid };
};

export default useForm;
