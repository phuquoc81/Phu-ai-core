import { validationResult } from 'express-validator'

/**
 * Runs express-validator checks and returns 422 with error details
 * if any validation fails. Place after the validation chain in a route.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  next()
}
