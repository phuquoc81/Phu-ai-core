'use strict';

const router     = require('express').Router();
const controller = require('../controllers/teamController');
const auth       = require('../middleware/auth');
const { defaultLimiter } = require('../middleware/rateLimiter');

router.post('/',                      defaultLimiter, auth, controller.createTeam);
router.get('/',                       auth,           controller.getTeam);
router.post('/members',               defaultLimiter, auth, controller.addMember);
router.delete('/members/:memberId',   auth,           controller.removeMember);

module.exports = router;
