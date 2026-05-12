const { Claim } = require('../models/claim.model');
const { Op } = require('sequelize');
const moment = require("moment");

// ─── Private check functions ──────────────────────────────────────────────────

const checkExactInvoiceNumber = async (invoiceNumber, insuranceType) => {
  return await Claim.findOne({
    where: { invoiceNumber, insuranceType, status: { [Op.ne]: 'rejected' } },
    attributes: ['claimId', 'username', 'status'],
  });
};

function normalizeDate(dateStr) {
  if (!dateStr) return null;

  const formats = [
    "DD/MM/YYYY",
    "MM/DD/YYYY",
    "YYYY-MM-DD",
    "DD-MM-YYYY",
    "DD.MM.YYYY"
  ];

  for (const format of formats) {
    const m = moment(dateStr, format, true);
    if (m.isValid()) {
      return m.format("YYYY-MM-DD");
    }
  }

  return null;
}

const checkSameUserAmountDate = async ({ username, totalAmount, invoiceDate }) => {
  const tolerance = totalAmount * 0.01; // 1% tolerance
  return await Claim.findOne({
    where: {
      username,
      claimAmount: { [Op.between]: [totalAmount - tolerance, totalAmount + tolerance] },
      invoiceDate,
      status: { [Op.ne]: 'rejected' },
    },
    attributes: ['claimId', 'username', 'status'],
  });
};

const checkProviderAmountDate = async ({ providerName, totalAmount, invoiceDate }) => {
  const tolerance = totalAmount * 0.01;
  return await Claim.findOne({
    where: {
      providerName,
      claimAmount: { [Op.between]: [totalAmount - tolerance, totalAmount + tolerance] },
      invoiceDate,
      status: { [Op.ne]: 'rejected' },
    },
    attributes: ['claimId', 'username', 'status'],
  });
};

const checkSubmissionVelocity = async (username) => {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const count = await Claim.count({
    where: { username, submittedAt: { [Op.gte]: oneDayAgo } },
  });
  return { count };
};

const checkNearDuplicateAmount = async ({ username, totalAmount, insuranceType }) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const tolerance = totalAmount * 0.05; // 5% tolerance
  return await Claim.findOne({
    where: {
      username,
      insuranceType,
      claimAmount: { [Op.between]: [totalAmount - tolerance, totalAmount + tolerance] },
      submittedAt: { [Op.gte]: thirtyDaysAgo },
      status: { [Op.ne]: 'rejected' },
    },
    attributes: ['claimId', 'username', 'status'],
  });
};

// ─── Public function ──────────────────────────────────────────────────────────

/**
 * Run all duplicate checks for a new incoming claim.
 * Returns { isDuplicate, duplicateOfClaimId, duplicateScore, reasons }
 */
const checkDuplicate = async ({ invoiceNumber, invoiceDate, totalAmount, providerName, username, insuranceType }) => {
  const reasons = [];
  let duplicateScore = 0;
  let matchedClaimId = null;

  invoiceDate = normalizeDate(invoiceDate);


  // Check 1: Exact invoice number match (strongest signal — 80pts)
  if (invoiceNumber) {
    const exactMatch = await checkExactInvoiceNumber(invoiceNumber, insuranceType);
    if (exactMatch) {
      reasons.push(`Exact invoice number "${invoiceNumber}" already exists in claim ${exactMatch.claimId}`);
      duplicateScore += 80;
      matchedClaimId = exactMatch.claimId;
    }
  }

  // Check 2: Same user + same amount + same date (70pts)
  if (username && totalAmount && invoiceDate) {
    const userMatch = await checkSameUserAmountDate({ username, totalAmount, invoiceDate });
    if (userMatch) {
      reasons.push(`User "${username}" already submitted ₹${totalAmount} on ${invoiceDate} — claim ${userMatch.claimId}`);
      duplicateScore += 70;
      if (!matchedClaimId) matchedClaimId = userMatch.claimId;
    }
  }

  // Check 3: Same provider + same amount + same date from different user (50pts — shared/reused bill)
  if (providerName && totalAmount && invoiceDate) {
    const providerMatch = await checkProviderAmountDate({ providerName, totalAmount, invoiceDate });
    if (providerMatch && providerMatch.username !== username) {
      reasons.push(`Provider "${providerName}" with ₹${totalAmount} on ${invoiceDate} already claimed — possible shared bill`);
      duplicateScore += 50;
      if (!matchedClaimId) matchedClaimId = providerMatch.claimId;
    }
  }

  // Check 4: Submission velocity — 3+ claims in 24 hours (30pts)
  if (username) {
    const velocity = await checkSubmissionVelocity(username);
    if (velocity.count >= 3) {
      reasons.push(`User "${username}" submitted ${velocity.count} claims in the last 24 hours — suspicious velocity`);
      duplicateScore += 30;
    }
  }

  // Check 5: Near-duplicate amount from same user in 30 days (25pts)
  if (username && totalAmount && insuranceType) {
    const nearDuplicate = await checkNearDuplicateAmount({ username, totalAmount, insuranceType });
    if (nearDuplicate) {
      reasons.push(`Similar amount submitted by "${username}" for ${insuranceType} insurance within 30 days — claim ${nearDuplicate.claimId}`);
      duplicateScore += 25;
      if (!matchedClaimId) matchedClaimId = nearDuplicate.claimId;
    }
  }

  return {
    isDuplicate: duplicateScore >= 70,
    duplicateOfClaimId: matchedClaimId,
    duplicateScore: Math.min(duplicateScore, 100),
    reasons,
  };
};

module.exports = { checkDuplicate,normalizeDate };