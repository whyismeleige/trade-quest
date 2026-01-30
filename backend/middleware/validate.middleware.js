const { ValidationError } = require("../utils/error.utils");

/**
 * Middleware to validate request data against a Zod schema
 * @param {Object} schema - Zod schema to validate against
 * @param {string} source - Where to get data from ('body', 'query', 'params')
 * @returns {Function} Express middleware function
 */
const validate = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      const dataToValidate = req[source];
      
      // Parse and validate the data
      const validatedData = schema.parse(dataToValidate);
      
      // Replace the original data with validated data
      req[source] = validatedData;
      
      next();
    } catch (error) {
      // Handle Zod validation errors
      if (error.name === "ZodError") {
        const errors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        
        const errorMessage = errors.map((e) => `${e.field}: ${e.message}`).join(", ");
        
        return next(new ValidationError(errorMessage));
      }
      
      // Pass other errors to error handler
      next(error);
    }
  };
};

module.exports = { validate };