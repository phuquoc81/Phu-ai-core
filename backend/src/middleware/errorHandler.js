/**
 * Global async error handler.
 * Wraps async route/controller functions so that unhandled promise
 * rejections are forwarded to Express's error handler.
 */
export const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

/**
 * Centralised Express error-handling middleware.
 * Must be registered LAST (after all routes).
 * The `_next` parameter is intentionally unused but required by Express
 * to recognise this as a 4-argument error handler.
 */
export const errorHandler = (err, req, res, _next) => {
  const status = err.statusCode || err.status || 500

  // Mongoose duplicate-key error
  if (err.code === 11000) {
    return res.status(409).json({ message: 'A record with that value already exists.' })
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message)
    return res.status(422).json({ message: messages.join('; ') })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Invalid or expired token.' })
  }

  // Stripe errors
  if (err.type && err.type.startsWith('Stripe')) {
    return res.status(502).json({ message: 'Payment service error. Please try again.' })
  }

  // Generic fallback — never expose stack trace to clients
  return res.status(status).json({ message: status === 500 ? 'Internal server error.' : err.message })
}
