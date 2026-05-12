const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});


// ─── Private helpers ──────────────────────────────────────────────────────────

const systemPrompt = () => `You are an expert insurance fraud detection AI. Analyze insurance claim bills and detect fraud patterns.

Always respond with a valid JSON object with EXACTLY this structure:
{
  "riskScore": <integer 0-100>,
  "status": <"approved" | "flagged" | "rejected" | "pending_review">,
  "fraudReasons": [<array of strings describing each detected risk/fraud reason>],
  "fraudPatterns": {
    "inflatedAmount": <boolean>,
    "duplicateIndicators": [<strings>],
    "missingFields": [<strings>],
    "suspiciousProvider": <boolean>,
    "dateAnomalies": <boolean>,
    "amountMismatch": <boolean>,
    "unusualLineItems": [<strings>],
    "documentTampering": <boolean>,
    "excessiveClaimVsPremium": <boolean>
  },
  "summary": "<2-3 sentence analysis summary>",
  "recommendation": "<what the claims officer should do>",
  "confidence": <integer 0-100>
}

Risk score: 0-20=clean, 21-40=low, 41-60=medium, 61-80=high, 81-100=likely fraud.
Status: approved(<30), pending_review(30-50), flagged(51-75), rejected(>75).`;

const buildPrompt = ({ extractedText, structuredData, premiumAmount, insuranceType, username }) => `
Analyze this insurance claim for fraud:

CLAIM DETAILS:
- Username: ${username}
- Insurance Type: ${insuranceType.toUpperCase()}
- Monthly Premium: ₹${premiumAmount}
- Claim Amount from Bill: ₹${structuredData?.totalAmount || 'Not detected'}

EXTRACTED BILL DATA:
- Invoice Number: ${structuredData?.invoiceNumber || 'NOT FOUND'}
- Invoice Date: ${structuredData?.invoiceDate || 'NOT FOUND'}
- Provider Name: ${structuredData?.providerName || 'NOT FOUND'}
- Patient Name: ${structuredData?.patientName || 'NOT FOUND'}
- GST Number: ${structuredData?.gstNumber || 'NOT FOUND'}
- Tax Amount: ₹${structuredData?.taxAmount || 'NOT FOUND'}
- Subtotal: ₹${structuredData?.subtotal || 'NOT FOUND'}

LINE ITEMS:
${structuredData?.lineItems?.join('\n') || 'No line items extracted'}

RAW OCR TEXT (first 1000 chars):
${(extractedText || '').substring(0, 1000)}

FRAUD CHECKS:
1. Is claim amount unreasonably high vs premium (>50x monthly)?
2. Are critical fields missing (invoice number, date, provider)?
3. Signs of document tampering or unusual formatting?
4. Line items consistent with ${insuranceType} insurance?
5. Suspicious round numbers everywhere (possible fabrication)?
6. Is the provider name generic or suspicious?
7. Date manipulation signs?
8. Items not matching the insurance type?

Respond ONLY with the JSON object.`;

const fallbackAnalysis = ({ structuredData, premiumAmount, insuranceType }) => {
  const reasons = [];
  const patterns = {
    inflatedAmount: false,
    duplicateIndicators: [],
    missingFields: [],
    suspiciousProvider: false,
    dateAnomalies: false,
    amountMismatch: false,
    unusualLineItems: [],
    documentTampering: false,
    excessiveClaimVsPremium: false,
  };
  let riskScore = 0;

  if (structuredData?.totalAmount && premiumAmount) {
    const ratio = structuredData.totalAmount / premiumAmount;
    if (ratio > 100) {
      riskScore += 40;
      patterns.excessiveClaimVsPremium = true;
      reasons.push(`Claim amount (₹${structuredData.totalAmount}) is ${ratio.toFixed(0)}x the monthly premium — extremely high`);
    } else if (ratio > 50) {
      riskScore += 20;
      patterns.inflatedAmount = true;
      reasons.push(`Claim amount is ${ratio.toFixed(0)}x the monthly premium — unusually high`);
    }
  }

  if (!structuredData?.invoiceNumber) { riskScore += 15; patterns.missingFields.push('Invoice number'); reasons.push('Invoice number not found in bill'); }
  if (!structuredData?.invoiceDate) { riskScore += 10; patterns.missingFields.push('Invoice date'); reasons.push('Invoice date not detected'); }
  if (!structuredData?.providerName) { riskScore += 10; patterns.missingFields.push('Provider name'); reasons.push('Provider name not found'); }
  if (!structuredData?.totalAmount) { riskScore += 15; patterns.missingFields.push('Total amount'); reasons.push('Total amount not clearly stated in bill'); }

  if (reasons.length === 0) reasons.push('No major rule-based fraud indicators detected');

  let status = 'approved';
  if (riskScore > 75) status = 'rejected';
  else if (riskScore > 50) status = 'flagged';
  else if (riskScore > 25) status = 'pending_review';

  return {
    riskScore: Math.min(riskScore, 100),
    status,
    fraudReasons: reasons,
    fraudPatterns: patterns,
    summary: `Rule-based fallback analysis. Risk: ${riskScore}/100. ${reasons.length} issue(s) found.`,
    recommendation: status === 'approved' ? 'Claim appears valid. Approve after manual check.' : 'Manual review required.',
    confidence: 60,
  };
};

// ─── Public function ──────────────────────────────────────────────────────────

/**
 * Analyze a claim for fraud patterns using GPT-4o
 * Falls back to rule-based analysis if OpenAI is unavailable
 */

function cleanAIResponse(raw) {
  if (!raw) return null;

  // remove markdown ```json ```
  const cleaned = raw
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("JSON parse failed:", err);
    return null;
  }
}


const analyzeFraud = async ({
  extractedText,
  structuredData,
  premiumAmount,
  insuranceType,
  username
}) => {
  try {

    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: systemPrompt()
        },
        {
          role: "user",
          content: buildPrompt({
            extractedText,
            structuredData,
            premiumAmount,
            insuranceType,
            username
          })
        }
      ],
      temperature: 0.2,
      max_tokens: 1500
    });

    const raw = completion.choices[0].message.content;

    let parsed;

    try {
      parsed = cleanAIResponse(raw);
    } catch {
      parsed = {
        fraud_score: 0,
        risk_level: "LOW",
        explanation: raw
      };
    }

    return {
      success: true,
      analysis: parsed,
      rawResponse: raw,
      tokensUsed: completion.usage?.total_tokens
    };

  } catch (error) {

    console.error("Groq API error:", error.message);

    return {
      success: false,
      analysis: fallbackAnalysis({
        structuredData,
        premiumAmount,
        insuranceType
      }),
      rawResponse: null,
      error: error.message
    };
  }
};

module.exports = { analyzeFraud };