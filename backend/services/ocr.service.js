const Tesseract = require('tesseract.js');
const pdf = require('pdf-parse');

const fs = require('fs');
const path = require('path');

// ─── Private helpers ──────────────────────────────────────────────────────────

const extractFromPDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return {
    rawText: data.text,
    pageCount: data.numpages,
    metadata: data.info,
    source: 'pdf-parse',
    confidence: 95,
  };
};

const extractFromImage = async (filePath) => {
  const result = await Tesseract.recognize(filePath, 'eng', { logger: () => {} });
  return {
    rawText: result.data.text,
    confidence: result.data.confidence,
    words: result.data.words?.map(w => ({ text: w.text, confidence: w.confidence, bbox: w.bbox })),
    source: 'tesseract',
    pageCount: 1,
  };
};


const extractInvoiceNumber = (text) => {
  const patterns = [
    /invoice\s*(?:no|number|#)[:\s]*([A-Z0-9\-\/]+)/i,
    /bill\s*(?:no|number|#)[:\s]*([A-Z0-9\-\/]+)/i,
    /receipt\s*(?:no|number|#)[:\s]*([A-Z0-9\-\/]+)/i,
    /(?:inv|rcpt)[:\s#]*([A-Z0-9\-\/]{4,20})/i,
  ];
  const cleanText = text.replace(/\s+/g, " ");
  
  for (const p of patterns) {
    const m = cleanText.match(p);
    if (m) return m[1].trim();
  }
  return null;
};

const extractDate = (text) => {

  const patterns = [
    /(?:date|dated)[:\s]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
    /(?:date|dated)[:\s]*(\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})/i,
    /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/,
    /(\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})/,
    /(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4})/i,
  ];

  const cleanText = Array.isArray(text)
    ? text.join(" ")
    : text;

  const normalized = cleanText.replace(/\s+/g, " ");

  for (const p of patterns) {
    const match = normalized.match(p);
    if (match) return match[1].trim();
  }

  return null;
};

const extractTotalAmount = (text) => {
  const patterns = [
    /(?:total|grand total|net total|amount due|total amount)[:\s]*(?:rs\.?|inr|₹|\$)?\s*([\d,]+\.?\d*)/i,
    /(?:rs\.?|inr|₹|\$)\s*([\d,]+\.?\d*)\s*(?:only|\/\-)?$/im,
  ];

  const cleanText = text.replace(/\s+/g, " ");
 
  for (const p of patterns) {
    const m = cleanText.match(p);
    if (m) return parseFloat(m[1].replace(/,/g, ''));
  }
  return null;
};

const extractProviderName = (lines) => {
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    if (lines[i].length > 3 && !/^\d/.test(lines[i])) return lines[i];
  }
  return null;
};

const extractPatientName = (text) => {
  const cleanText = text.replace(/\s+/g, " ");
  const m = cleanText.match(/(?:patient|name|mr\.|mrs\.|ms\.)[:\s]+([A-Za-z\s]{3,40})/i);
  return m ? m[1].trim() : null;
};

const extractLineItems = (lines) => {
  const amountPattern = /(?:rs\.?|₹|\$)?\s*([\d,]+\.?\d{0,2})/i;
  return lines
    .filter(line => amountPattern.test(line) && line.length > 5)
    .filter(line => {
      const m = line.match(amountPattern);
      return m && parseFloat(m[1].replace(/,/g, '')) > 0;
    })
    .slice(0, 20);
};

const extractTaxAmount = (text) => {
  const cleanText = text.replace(/\s+/g, " ");
  const m = cleanText.match(/(?:gst|tax|cgst|sgst|igst)[:\s]*(?:rs\.?|₹|\$)?\s*([\d,]+\.?\d*)/i);
  return m ? parseFloat(m[1].replace(/,/g, '')) : null;
};

const extractSubtotal = (text) => {
  const cleanText = text.replace(/\s+/g, " ");
  const m = cleanText.match(/(?:subtotal|sub total|sub-total)[:\s]*(?:rs\.?|₹|\$)?\s*([\d,]+\.?\d*)/i);
  return m ? parseFloat(m[1].replace(/,/g, '')) : null;
};

const extractGST = (text) => {
  const cleanText = text.replace(/\s+/g, " ");
  const m = cleanText.match(/(?:gstin|gst\s*no)[:\s]*([A-Z0-9]{15})/i);
  return m ? m[1] : null;
};

const extractPhoneNumbers = (text) => {
  const cleanText = text.replace(/\s+/g, " ");
  const matches = cleanText.match(/(?:\+91[\s\-]?)?[6-9]\d{9}/g);
  return matches ? [...new Set(matches)] : [];
};

const extractEmails = (text) => {
  const cleanText = text.replace(/\s+/g, " ");
  const matches = cleanText.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g);
  return matches ? [...new Set(matches)] : [];
};

// ─── Public functions ─────────────────────────────────────────────────────────

/**
 * Extract raw text from PDF or image file using OCR
 */
const extractText = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  try {
    if (ext === '.pdf') return await extractFromPDF(filePath);
    if (['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp'].includes(ext)) return await extractFromImage(filePath);
    throw new Error(`Unsupported file type: ${ext}`);
  } catch (error) {
    throw new Error(`OCR failed: ${error.message}`);
  }
};

/**
 * Parse structured fields (invoice number, date, amounts, etc.) from raw OCR text
 */
const parseStructuredData = (rawText) => {
  const text = rawText || '';
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  return {
    invoiceNumber: extractInvoiceNumber(text),
    invoiceDate: extractDate(lines),
    totalAmount: extractTotalAmount(text),
    providerName: extractProviderName(lines),
    patientName: extractPatientName(text),
    lineItems: extractLineItems(lines),
    taxAmount: extractTaxAmount(text),
    subtotal: extractSubtotal(text),
    gstNumber: extractGST(text),
    phoneNumbers: extractPhoneNumbers(text),
    emails: extractEmails(text),
    rawLines: lines.slice(0, 30),
  };
};

module.exports = { extractText, parseStructuredData };