// middleware/validateRequest.js
const validateRequest = (schema) => {
    return async (req, res, next) => {
      try {
        // Validate entire request body
        await schema.validateAsync(req.body, { abortEarly: false });
        next();
      } catch (error) {
        const messages = error.details.map((err) => err.message).join(', ');
        res.status(400).json({ error: messages });
      }
    };
  };
  
  module.exports = validateRequest;
  