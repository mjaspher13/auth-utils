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
    if (schema[name]) {
      try {
        schema[name](value).validate();
        return null;
      } catch (error) {
        return error.message;
      }
    }
    return null;
  }, [schema]);

  const handleChange = useCallback((name, value) => {
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
    const error = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  }, [validateField]);

  const handleSubmit = (callback) => (event) => {
    event.preventDefault();
    const newErrors = {};
    let isValid = true;

    for (const key in schema) {
      if (schema.hasOwnProperty(key)) {
        const error = validateField(key, values[key]);
        if (error) {
          isValid = false;
          newErrors[key] = error;
        }
      }
    }

    setErrors(newErrors);

    if (isValid) {
      callback(values);
    }
  };

  const register = (name) => ({
    inputName: name,
    value: values[name] || '',
    onChange: (e) => handleChange(name, e.target.value),
    statusUpdateCallback: (status) => {
      handleChange(name, status.rawValue);
    },
    errorMessages: errors[name] ? { default: errors[name] } : {},
  });

  return { register, handleSubmit, values, errors };
};

export default useForm;
