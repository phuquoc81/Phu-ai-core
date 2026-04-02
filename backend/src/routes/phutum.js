import express from 'express';
import { protect } from '../middleware/auth.js';
import { runDiagnostics, applyAutoFix } from '../controllers/phutumController.js';

const router = express.Router();

/**
 * Phutum Core: The Ultimate AI Orchestrator
 * Automation and combined AI agent services.
 */

// POST /api/phutum/diagnostics - Run system diagnostics
router.post('/diagnostics', protect, runDiagnostics);

// POST /api/phutum/autofix - Apply AI-driven fixes
router.post('/autofix', protect, applyAutoFix);

export default router;
