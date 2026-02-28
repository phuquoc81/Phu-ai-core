'use strict';

module.exports = {
  secret:    process.env.JWT_SECRET    || 'change_me',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
};
