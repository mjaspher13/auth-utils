import { useState, useCallback } from 'react';
import { validateSchema } from './zod';

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
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
    const error = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  }, [validateField]);

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

  return { handleStatusUpdate, handleSubmit, values, errors };
};

export default useForm;
