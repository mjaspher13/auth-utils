/**
 * Base class for all validators.
 * Handles common validation logic and error handling.
 */
class ZodValidator {
  constructor(value, isOptional = false) {
    this.errors = [];
    this.value = value;
    this.isOptional = isOptional;

    if (!isOptional && value === undefined) {
      this.errors.push("Value is required");
    }
  }

  optional() {
    this.isOptional = true;
    return this;
  }

  validate() {
    if (this.isOptional && this.value === undefined) {
      return this.value;
    }

    if (this.errors.length > 0) {
      throw new Error(`Validation errors: ${this.errors.join(", ")}`);
    }
    return this.value;
  }
}

class StringValidator extends ZodValidator {
  constructor(value) {
    super(value);
    if (value !== undefined && typeof value !== "string") {
      this.errors.push("Expected string");
    }
  }

  minLength(length) {
    if (this.value !== undefined && this.value.length < length) {
      this.errors.push(`String should be at least ${length} characters long`);
    }
    return this;
  }

  maxLength(length) {
    if (this.value !== undefined && this.value.length > length) {
      this.errors.push(`String should be at most ${length} characters long`);
    }
    return this;
  }

  email() {
    if (this.value !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.value)) {
        this.errors.push("Invalid email format");
      }
    }
    return this;
  }
}

class NumberValidator extends ZodValidator {
  constructor(value) {
    super(value);
    if (value !== undefined && typeof value !== "number") {
      this.errors.push("Expected number");
    }
  }

  min(value) {
    if (this.value !== undefined && this.value < value) {
      this.errors.push(`Number should be at least ${value}`);
    }
    return this;
  }

  max(value) {
    if (this.value !== undefined && this.value > value) {
      this.errors.push(`Number should be at most ${value}`);
    }
    return this;
  }
}

class ObjectValidator extends ZodValidator {
  constructor(value) {
    super(value);
    if (value !== undefined && (typeof value !== "object" || value === null)) {
      this.errors.push("Expected object");
    }
  }

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

const Zod = {
  string: (value) => new StringValidator(value),
  number: (value) => new NumberValidator(value),
  object: (value) => new ObjectValidator(value),
};

/**
 * Validates an object against a schema.
 * @param {Object} schema - The validation schema.
 * @param {Object} data - The data to validate.
 * @return {Object} - The validated data.
 * @throws {Error} - Throws an error if validation fails.
 */
function validateSchema(schema, data) {
  const validationSchema = Zod.object(schema);
  return validationSchema.shape(schema).validate(data);
}

export default Zod;
export { validateSchema };
