/**
 * Generates unique claim IDs in format: CLM-YYYYMMDD-XXXXXX
 */
const generateClaimId = (insuranceType) => {
  const prefix = {
    health: 'HLT',
    bike: 'BKE',
    car: 'CAR',
  }[insuranceType] || 'CLM';

  const date = new Date();
  const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `${prefix}-${datePart}-${randomPart}`;
};

module.exports = { generateClaimId };