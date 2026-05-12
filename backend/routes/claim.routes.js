const express = require('express');
const router = express.Router();
const { submitClaim, getClaimById, listClaims, getStats, getTopRiskClaims,getLatestClaims, getClaimByUsername } = require('../controllers/claim.controller');
const { upload, handleMulterError } = require('../middleware/upload.middleware');

const authMiddleware = require('../middleware/auth.middleware')

/**
 * @route   POST /api/claims/submit
 * @desc    Submit a new claim + bill file for OCR + AI fraud detection
 * @body    premiumAmount, insuranceType (health|bike|car), username
 * @file    billFile — PDF, JPG, PNG (max 10MB)
 */
router.post('/submit', upload.single('billFile'), authMiddleware, handleMulterError, submitClaim);

/**
 * @route   GET /api/claims/stats/summary
 * @desc    Aggregated fraud detection statistics
 */
router.get('/stats/summary',authMiddleware, getStats);

/**
 * @route   GET /api/claims
 * @desc    List claims — filter by username, status, insuranceType; paginate with page & limit
 */
router.get('/',authMiddleware, listClaims);

/**
 * @route   GET /api/claims/:claimId
 * @desc    Fetch a single claim by claim ID
 */
router.get('/:claimId',authMiddleware, getClaimById);

router.get('/ind/:claimemail',authMiddleware, getClaimByUsername);


router.get("/risk/top-risk", authMiddleware, getTopRiskClaims);
router.get("/top/latest", authMiddleware, getLatestClaims);

module.exports = router;