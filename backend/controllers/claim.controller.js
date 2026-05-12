const { Claim } = require('../models/claim.model');
const { extractText, parseStructuredData } = require('../services/ocr.service');
const { analyzeFraud } = require('../services/aifraud.service');
const { checkDuplicate,normalizeDate } = require('../services/duplication.service');
const { generateClaimId } = require('../services/claimid.service');
const { Op } = require('sequelize');

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getRiskLevel = (score) => {
  if (score <= 20) return 'VERY LOW';
  if (score <= 40) return 'LOW';
  if (score <= 60) return 'MEDIUM';
  if (score <= 80) return 'HIGH';
  return 'CRITICAL';
};

function parseAIAnalysis(aiAnalysis) {
  if (!aiAnalysis) return null;

  try {
    const cleaned = aiAnalysis
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("AI parse failed:", err);
    return null;
  }
}

const formatClaimResponse = (claim) => ({
  claimId: claim.claimId,
  username: claim.username,
  premiumAmount: parseFloat(claim.premiumAmount),
  insuranceType: claim.insuranceType,
  claimAmount: claim.claimAmount ? parseFloat(claim.claimAmount) : null,
  riskScore: claim.riskScore,
  riskLevel: getRiskLevel(claim.riskScore),
  status: claim.status,
  isDuplicate: claim.isDuplicate,
  duplicateOfClaimId: claim.duplicateOfClaimId,
  fraudReasons: claim.fraudReasons || [],
  fraudPatterns: claim.fraudPatterns || {},
  billDetails: {
    fileName: claim.billFileName,
    invoiceNumber: claim.invoiceNumber,
    invoiceDate: claim.invoiceDate,
    providerName: claim.providerName,
  },
  aiSummary: (() => {
    try { 
    return claim.aiAnalysis ? parseAIAnalysis(claim.aiAnalysis)?.summary : null; 
  }
  catch { return null; }
  })(),
  submittedAt: claim.submittedAt,
  createdAt: claim.createdAt,
});

const computeFinalStatus = (riskScore, isDuplicate) => {
  if (isDuplicate) return 'rejected';
  if (riskScore > 75) return 'rejected';
  if (riskScore > 50) return 'flagged';
  if (riskScore > 25) return 'pending_review';
  return 'approved';
};

// ─── Controller Functions ─────────────────────────────────────────────────────

/**
 * POST /api/claims/submit
 * Submit a new insurance claim with bill file for fraud detection
 */
const submitClaim = async (req, res) => {
  const startTime = Date.now();

  try {
    const { premiumAmount, insuranceType, username } = req.body;
    // Input validation
    if (!premiumAmount || isNaN(parseFloat(premiumAmount))) {
      return res.status(400).json({ success: false, message: 'Valid premium amount is required' });
    }
    if (!insuranceType || !['health', 'bike', 'car'].includes(insuranceType.toLowerCase())) {
      return res.status(400).json({ success: false, message: 'Insurance type must be: health, bike, or car' });
    }
    if (!username || username.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Username is required' });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Bill file is required (PDF, JPG, or PNG)' });
    }

    if (req.file.mimetype !== "application/pdf") {
  return res.status(400).json({
    success: false,
    message: "Only PDF files are allowed"
  });
}

    const type = insuranceType.toLowerCase();
    const premium = parseFloat(premiumAmount);


    const user = username.trim().toLowerCase();
    const claimId = generateClaimId(type);
    const filePath = req.file.path;

    // Step 1: OCR — extract & parse text from bill
    console.log(`[${claimId}] Running OCR...`);
    let ocrResult = { rawText: '', confidence: 0, source: 'failed' };
    let structuredData = {};
    try {
      ocrResult = await extractText(filePath);
      structuredData = parseStructuredData(ocrResult.rawText);
    } catch (ocrError) {
      console.error(`[${claimId}] OCR error:`, ocrError.message);
    }

    // Step 2: Duplicate detection
    console.log(`[${claimId}] Checking for duplicates...`);
    const duplicateCheck = await checkDuplicate({
      invoiceNumber: structuredData?.invoiceNumber,
      invoiceDate: structuredData?.invoiceDate,
      totalAmount: structuredData?.totalAmount,
      providerName: structuredData?.providerName,
      username: user,
      insuranceType: type,
    });


    // Step 3: AI fraud analysis via GPT
    console.log(`[${claimId}] Running AI fraud analysis...`);
    const aiResult = await analyzeFraud({
      extractedText: ocrResult.rawText,
      structuredData,
      premiumAmount: premium,

      insuranceType: type,
      username: user,
    });
   
    const aiAnalysis = aiResult.analysis;
     const allFraudReasons = [...(aiAnalysis.fraudReasons || [])];
  const cleanReason = (reason) =>
  String(reason)
    .replace(/\\"/g, "")
    .replace(/"/g, "")
    .trim();

if (duplicateCheck.isDuplicate) {
  allFraudReasons.unshift(
    ...duplicateCheck.reasons.map(r => cleanReason(r))
  );
} else if (duplicateCheck.reasons.length > 0) {
  allFraudReasons.push(
    ...duplicateCheck.reasons.map(r => cleanReason(r))
  );
}

    // Step 5: Compute final risk score and status
    let finalRiskScore = aiAnalysis.riskScore || 0;
    if (duplicateCheck.isDuplicate) finalRiskScore = Math.min(100, finalRiskScore + 30);
    else if (duplicateCheck.duplicateScore > 30) finalRiskScore = Math.min(100, finalRiskScore + 10);

    const finalStatus = computeFinalStatus(finalRiskScore, duplicateCheck.isDuplicate);
    const processingTime = Date.now() - startTime;


    // Step 6: Save claim to database
    const claim = await Claim.create({
      claimId,
      username: user,
      premiumAmount: premium,
      insuranceType: type,
      claimAmount: structuredData?.totalAmount || null,
      billFileName: req.file.originalname,
      billFilePath: filePath,
      extractedText: ocrResult.rawText?.substring(0, 5000) || null,
      riskScore: finalRiskScore,
      status: finalStatus, 
      isDuplicate: duplicateCheck.isDuplicate,
      duplicateOfClaimId: duplicateCheck.duplicateOfClaimId || null,
      fraudReasons: allFraudReasons,
      fraudPatterns: aiAnalysis.fraudPatterns || null,
      ocrData: structuredData,
      aiAnalysis: aiResult.rawResponse,
      invoiceNumber: structuredData?.invoiceNumber || null,
      invoiceDate: normalizeDate(structuredData?.invoiceDate) || null,
      providerName: structuredData?.providerName || null,
      processingTimeMs: processingTime,
      submittedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: 'Claim submitted and analyzed successfully',
      data: {
        claimId: claim.claimId,
        username: claim.username,
        premiumAmount: parseFloat(claim.premiumAmount),
        insuranceType: claim.insuranceType,
        claimAmount: claim.claimAmount ? parseFloat(claim.claimAmount) : null,
        riskScore: claim.riskScore,
        riskLevel: getRiskLevel(claim.riskScore),
        status: claim.status,
        fraudReasons: claim.fraudReasons || [],
        fraudPatterns: claim.fraudPatterns || {},
        isDuplicate: claim.isDuplicate,
        duplicateOfClaimId: claim.duplicateOfClaimId,
        billDetails: {
          fileName: claim.billFileName,
          invoiceNumber: claim.invoiceNumber,
          invoiceDate: claim.invoiceDate,
          providerName: claim.providerName,
          ocrConfidence: ocrResult.confidence,
          extractedFields: {
            patientName: structuredData?.patientName,
            gstNumber: structuredData?.gstNumber,
            taxAmount: structuredData?.taxAmount,
            subtotal: structuredData?.subtotal,
            lineItemCount: structuredData?.lineItems?.length || 0,
          },
        },
        aiSummary: aiAnalysis.summary || null,
        recommendation: aiAnalysis.recommendation || null,
        aiConfidence: aiAnalysis.confidence || null,
        submittedAt: claim.submittedAt,
        processingTimeMs: processingTime,
      },
    });
  } catch (error) {
    console.error('submitClaim error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during claim processing',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * GET /api/claims/:claimId
 * Fetch a single claim by its claim ID
 */
const getClaimById = async (req, res) => {
  try {
    const { claimId } = req.params;
    const claim = await Claim.findOne({ where: { claimId } });

    if (!claim) {
      return res.status(404).json({ success: false, message: `Claim ${claimId} not found` });
    }


    return res.json({ success: true, data: formatClaimResponse(claim) });
  } catch (error) {
    console.error('getClaimById error:', error);
    return res.status(500).json({ success: false, message: 'Error retrieving claim' });
  }
};

/**
 * GET /api/claims
 * List claims with optional filters: username, status, insuranceType, page, limit
 */
const listClaims = async (req, res) => {
  try {
    const {
      username, status, insuranceType,
      page = 1, limit = 20,
      sortBy = 'submittedAt', order = 'DESC',
    } = req.query;

    const where = {};
    if (username) where.username = username.toLowerCase();
    if (status) where.status = status;
    if (insuranceType) where.insuranceType = insuranceType.toLowerCase();

    const allowedSort = ['submittedAt', 'riskScore', 'premiumAmount', 'claimAmount', 'createdAt'];
    const sortField = allowedSort.includes(sortBy) ? sortBy : 'submittedAt';
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Claim.findAndCountAll({
      where,
      order: [[sortField, order === 'ASC' ? 'ASC' : 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    return res.json({
      success: true,
      data: rows.map(formatClaimResponse),
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('listClaims error:', error);
    return res.status(500).json({ success: false, message: 'Error listing claims' });
  }
};

/**
 * GET /api/claims/stats/summary
 * Aggregated fraud detection statistics
 */
const getStats = async (req, res) => {
  try {
    const [total, approved, flagged, rejected, pendingReview, duplicates, highRisk] = await Promise.all([
      Claim.count(),
      Claim.count({ where: { status: 'approved' } }),
      Claim.count({ where: { status: 'flagged' } }),
      Claim.count({ where: { status: 'rejected' } }),
      Claim.count({ where: { status: 'pending_review' } }),
      Claim.count({ where: { isDuplicate: true } }),
      Claim.count({ where: { riskScore: { [Op.gte]: 60 } } }),
    ]);

    return res.json({
      success: true,
      data: {
        totalClaims: total,
        byStatus: { approved, flagged, rejected, pendingReview },
        duplicateClaimsDetected: duplicates,
        highRiskClaims: highRisk,
        fraudDetectionRate: total > 0
          ? (((flagged + rejected) / total) * 100).toFixed(1) + '%'
          : '0%',
      },
    });
  } catch (error) {
    console.error('getStats error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
};


const getClaimByUsername = async (req, res) => {
  try {
    const { claimemail } = req.params;
    const claim = await Claim.findAll({ where: { username:claimemail } });

    if (!claim) {
      return res.status(404).json({ success: false, message: `Claim ${claimemail} not found` });
    }


    return res.json({ success: true, data: claim.map(formatClaimResponse) });
  } catch (error) {
    console.error('getClaimById error:', error);
    return res.status(500).json({ success: false, message: 'Error retrieving claim' });
  }
};

const getTopRiskClaims = async (req, res) => {
  try {

    const claims = await Claim.findAll({
      order: [['riskScore', 'DESC']],
      limit: 5
    });

    return res.json({
      success: true,
      count: claims.length,
      data: claims
    });

  } catch (error) {
    console.error("getTopRiskClaims error:", error);

    return res.status(500).json({
      success: false,
      message: "Error retrieving top risk claims"
    });
  }
};

const getLatestClaims = async (req, res) => {
  try {

    const claims = await Claim.findAll({
      order: [['created_at', 'DESC']],
      limit: 5
    });


    return res.json({
      success: true,
      count: claims.length,
      data: claims
    });

  } catch (error) {
    console.error("getLatestClaims error:", error);

    return res.status(500).json({
      success: false,
      message: "Error retrieving latest claims"
    });
  }
};

module.exports = { submitClaim, getClaimById, listClaims, getStats, getClaimByUsername, getTopRiskClaims, getLatestClaims };
