/**
 * Base class for all validators.
 * Handles common validation logic and error handling.
 */
class ZodValidator {
  /**
   * Constructor for ZodValidator.
   * @param {*} value - The value to be validated.
   * @param {boolean} [isOptional=false] - Whether the value is optional.
   * @param {boolean} [isNullable=false] - Whether the value can be null.
   */
  constructor(value, isOptional = false, isNullable = false) {
    this.errors = [];
    this.value = value;
    this.isOptional = isOptional;
    this.isNullable = isNullable;

    // If the value is not optional and is undefined, add an error
    if (!isOptional && value === undefined) {
      this.errors.push('Value is required');
    }

    // If the value is not nullable and is null, add an error
    if (!isNullable && value === null) {
      this.errors.push('Value cannot be null');
    }
  }

  /**
   * Mark the value as optional.
   * @returns {ZodValidator} - The instance of the validator.
   */
  optional() {
    this.isOptional = true;
    return this;
  }

  /**
   * Mark the value as nullable.
   * @returns {ZodValidator} - The instance of the validator.
   */
  nullable() {
    this.isNullable = true;
    return this;
  }

  /**
   * Set a default value if the value is undefined.
   * @param {*} defaultValue - The default value to be used.
   * @returns {ZodValidator} - The instance of the validator.
   */
  default(defaultValue) {
    if (this.value === undefined) {
      this.value = defaultValue;
    }
    return this;
  }

  /**
   * Validate the value and return it if valid.
   * @returns {*} - The validated value.
   * @throws {Error} - Throws an error if validation fails.
   */
  validate() {
    if (this.isOptional && this.value === undefined) {
      return this.value;
    }

    if (this.isNullable && this.value === null) {
      return this.value;
    }

    if (this.errors.length > 0) {
      throw new Error(`Validation errors: ${this.errors.join(', ')}`);
    }
    return this.value;
  }
}

/**
 * Validator class for strings.
 */
class StringValidator extends ZodValidator {
  /**
   * Constructor for StringValidator.
   * @param {*} value - The value to be validated.
   */
  constructor(value) {
    super(value);
    if (value !== undefined && value !== null && typeof value !== 'string') {
      this.errors.push('Expected string');
    }
  }

  /**
   * Ensure the string has a minimum length.
   * @param {number} length - The minimum length.
   * @returns {StringValidator} - The instance of the validator.
   */
  minLength(length) {
    if (this.value !== undefined && this.value.length < length) {
      this.errors.push(`String should be at least ${length} characters long`);
    }
    return this;
  }

  /**
   * Ensure the string has a maximum length.
   * @param {number} length - The maximum length.
   * @returns {StringValidator} - The instance of the validator.
   */
  maxLength(length) {
    if (this.value !== undefined && this.value.length > length) {
      this.errors.push(`String should be at most ${length} characters long`);
    }
    return this;
  }

  /**
   * Ensure the string is a valid email format.
   * @returns {StringValidator} - The instance of the validator.
   */
  email() {
    if (this.value !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.value)) {
        this.errors.push('Invalid email format');
      }
    }
    return this;
  }

  /**
   * Ensure the string is not empty.
   * @returns {StringValidator} - The instance of the validator.
   */
  nonempty() {
    if (this.value !== undefined && this.value.trim().length === 0) {
      this.errors.push('String cannot be empty');
    }
    return this;
  }
}

/**
 * Validator class for numbers.
 */
class NumberValidator extends ZodValidator {
  /**
   * Constructor for NumberValidator.
   * @param {*} value - The value to be validated.
   */
  constructor(value) {
    super(value);
    if (value !== undefined && value !== null && typeof value !== 'number') {
      this.errors.push('Expected number');
    }
  }

  /**
   * Ensure the number is at least a given value.
   * @param {number} value - The minimum value.
   * @returns {NumberValidator} - The instance of the validator.
   */
  min(value) {
    if (this.value !== undefined && this.value < value) {
      this.errors.push(`Number should be at least ${value}`);
    }
    return this;
  }

  /**
   * Ensure the number is at most a given value.
   * @param {number} value - The maximum value.
   * @returns {NumberValidator} - The instance of the validator.
   */
  max(value) {
    if (this.value !== undefined && this.value > value) {
      this.errors.push(`Number should be at most ${value}`);
    }
    return this;
  }
}

/**
 * Validator class for objects.
 */
class ObjectValidator extends ZodValidator {
  /**
   * Constructor for ObjectValidator.
   * @param {*} value - The value to be validated.
   */
  constructor(value) {
    super(value);
    if (value !== undefined && value !== null && (typeof value !== 'object' || value === null)) {
      this.errors.push('Expected object');
    }
  }

  /**
   * Validate the shape of the object based on a schema.
   * @param {Object} schema - The validation schema.
   * @returns {ObjectValidator} - The instance of the validator.
   */
  shape(schema) {
    for (const key in schema) {
      if (schema.hasOwnProperty(key)) {
        try {
          this.value[key] = schema[key](this.value[key]).validate();
        } catch (e) {
          this.errors.push(`${key}: ${e.message}`);
        }
      }
    }
    return this;
  }
}

/**
 * Validator class for booleans.
 */
class BooleanValidator extends ZodValidator {
  /**
   * Constructor for BooleanValidator.
   * @param {*} value - The value to be validated.
   */
  constructor(value) {
    super(value);
    if (value !== undefined && value !== null && typeof value !== 'boolean') {
      this.errors.push('Expected boolean');
    }
  }
}

/**
 * Validator class for any type.
 */
class AnyValidator extends ZodValidator {
  /**
   * Constructor for AnyValidator.
   * @param {*} value - The value to be validated.
   */
  constructor(value) {
    super(value);
  }
}

/**
 * Zod object containing factory methods for validators.
 */
const Zod = {
  string: (value) => new StringValidator(value),
  number: (value) => new NumberValidator(value),
  object: (value) => new ObjectValidator(value),
  boolean: (value) => new BooleanValidator(value),
  any: (value) => new AnyValidator(value),
};

/**
 * Validates an object against a schema.
 * @param {Object} schema - The validation schema.
 * @param {Object} data - The data to validate.
 * @returns {Object} - The validated data.
 * @throws {Error} - Throws an error if validation fails.
 */
function validateSchema(schema, data) {
  const validationSchema = Zod.object(schema);
  return validationSchema.shape(schema).validate(data);
}

export default Zod;
export { validateSchema };
