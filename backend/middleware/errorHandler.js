/**
 * Global Error Handler Middleware
 * 
 * ARCHITECTURE PURPOSE:
 * Acts as the final safety net in the middleware pipeline.
 * Catches errors from any controller and converts them to proper HTTP responses.
 * 
 * ERROR FLOW:
 * 1. Controller throws error or calls next(error)
 * 2. Error Handler middleware catches it (4 parameters: err, req, res, next)
 * 3. Identifies error type (ValidationError, JWT, Duplicate key, etc.)
 * 4. Returns appropriate HTTP status code and error message
 * 5. Response sent to client
 * 
 * EXAMPLE ERROR TYPES:
 * - ValidationError (400): Missing required fields
 * - Duplicate Key (400): Duplicate email or unique constraint violation
 * - JsonWebTokenError (401): Invalid authentication token
 * - TokenExpiredError (401): Token expired
 * - Not Found (404): Resource doesn't exist
 * - Server Error (500): Unexpected database or application error
 * 
 * USAGE IN CONTROLLER:
 * async function deleteStaff(req, res) {
 *   try {
 *     await prisma.staff.delete(...);
 *     res.json({ success: true });
 *   } catch (error) {
 *     // This error is caught by this middleware automatically
 *     // or explicitly: next(error)
 *   }
 * }
 */

// Global Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(err.errors).map(e => e.message),
    });
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
    });
  }

  // Generic error response
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
};

module.exports = errorHandler;
