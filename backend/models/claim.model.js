const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db');

const defineClaimModel = () => {
  return sequelize.define('Claim', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    claimId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      field: 'claim_id',
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    premiumAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: 'premium_amount',
    },
    insuranceType: {
      type: DataTypes.ENUM('health', 'bike', 'car'),
      allowNull: false,
      field: 'insurance_type',
    },
    claimAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      field: 'claim_amount',
    },
    billFileName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'bill_file_name',
    },
    billFilePath: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'bill_file_path',
    },
    extractedText: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'extracted_text',
    },
    riskScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'risk_score',
      comment: '0-100 scale. 0=no risk, 100=definite fraud',
    },
    status: {
      type: DataTypes.ENUM('approved', 'flagged', 'rejected', 'pending_review'),
      allowNull: false,
      defaultValue: 'pending_review',
    },
    isDuplicate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_duplicate',
    },
    duplicateOfClaimId: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'duplicate_of_claim_id',
    },
    fraudReasons: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'fraud_reasons',
      comment: 'Array of detected fraud/risk reasons',
    },
    fraudPatterns: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'fraud_patterns',
      comment: 'Detailed fraud pattern analysis from AI',
    },
    ocrData: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'ocr_data',
      comment: 'Structured data extracted via OCR',
    },
    aiAnalysis: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'ai_analysis',
      comment: 'Full GPT-4o analysis response',
    },
    invoiceNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'invoice_number',
    },
    invoiceDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'invoice_date',
    },
    providerName: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'provider_name',
    },
    processingTimeMs: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'processing_time_ms',
    },
    submittedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'submitted_at',
    },
  }, {
    tableName: 'claims',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['claim_id'] },
      { fields: ['username'] },
      { fields: ['invoice_number'] },
      { fields: ['status'] },
      { fields: ['insurance_type'] },
    ],
  });
};

const Claim = defineClaimModel();

module.exports = { Claim };