'use strict';

const secret = process.env.JWT_SECRET || (
  process.env.NODE_ENV === 'production'
    ? (() => { throw new Error('JWT_SECRET must be set in production'); })()
    : 'change_me'
);

module.exports = {
  secret:    secret,
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
};
