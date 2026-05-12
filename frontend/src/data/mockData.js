export const customers = [
  { id: "CUS-001", name: "Aarav Sharma", email: "aarav.sharma@email.com", phone: "+91 98765 43210", kycStatus: "Complete", claimsCount: 2, city: "Mumbai" },
  { id: "CUS-002", name: "Priya Patel", email: "priya.patel@email.com", phone: "+91 87654 32109", kycStatus: "Complete", claimsCount: 1, city: "Ahmedabad" },
  { id: "CUS-003", name: "Rohit Gupta", email: "rohit.gupta@email.com", phone: "+91 76543 21098", kycStatus: "Pending", claimsCount: 1, city: "Delhi" },
  { id: "CUS-004", name: "Sneha Reddy", email: "sneha.reddy@email.com", phone: "+91 65432 10987", kycStatus: "Complete", claimsCount: 3, city: "Hyderabad" },
  { id: "CUS-005", name: "Vikram Singh", email: "vikram.singh@email.com", phone: "+91 54321 09876", kycStatus: "Complete", claimsCount: 1, city: "Jaipur" },
  { id: "CUS-006", name: "Ananya Iyer", email: "ananya.iyer@email.com", phone: "+91 43210 98765", kycStatus: "Pending", claimsCount: 2, city: "Chennai" },
  { id: "CUS-007", name: "Karan Mehta", email: "karan.mehta@email.com", phone: "+91 32109 87654", kycStatus: "Complete", claimsCount: 1, city: "Pune" },
  { id: "CUS-008", name: "Deepika Nair", email: "deepika.nair@email.com", phone: "+91 21098 76543", kycStatus: "Complete", claimsCount: 2, city: "Kochi" },
  { id: "CUS-009", name: "Arjun Deshmukh", email: "arjun.deshmukh@email.com", phone: "+91 10987 65432", kycStatus: "Pending", claimsCount: 1, city: "Nagpur" },
  { id: "CUS-010", name: "Meera Joshi", email: "meera.joshi@email.com", phone: "+91 09876 54321", kycStatus: "Complete", claimsCount: 1, city: "Bangalore" },
];

export const claims = [
  { id: "CLM-1001", customerId: "CUS-001", customerName: "Aarav Sharma", type: "Health", amount: 245000, riskScore: 82, status: "Pending", dateSubmitted: "2025-02-14", description: "Hospitalization for cardiac procedure at Apollo Hospital, Mumbai.", ipLocation: "Bucharest, Romania", passwordChangedRecently: true, treatmentCode: "CARD-2210", duplicateClaimId: "CLM-0887", duplicateMatchPercent: 98 },
  { id: "CLM-1002", customerId: "CUS-002", customerName: "Priya Patel", type: "Motor", amount: 87500, riskScore: 25, status: "Settled", dateSubmitted: "2025-01-22", description: "Fender bender repair for Maruti Swift at authorized service center.", ipLocation: "Ahmedabad, India", passwordChangedRecently: false, treatmentCode: "MOT-1105", duplicateClaimId: null, duplicateMatchPercent: null },
  { id: "CLM-1003", customerId: "CUS-003", customerName: "Rohit Gupta", type: "Health", amount: 520000, riskScore: 67, status: "Pending", dateSubmitted: "2025-03-01", description: "Knee replacement surgery at Fortis Hospital, Delhi.", ipLocation: "Delhi, India", passwordChangedRecently: false, treatmentCode: "ORTH-3301", duplicateClaimId: null, duplicateMatchPercent: null },
  { id: "CLM-1004", customerId: "CUS-004", customerName: "Sneha Reddy", type: "Property", amount: 1250000, riskScore: 45, status: "Settled", dateSubmitted: "2024-12-10", description: "Water damage to ground floor due to monsoon flooding.", ipLocation: "Hyderabad, India", passwordChangedRecently: false, treatmentCode: "PROP-4420", duplicateClaimId: null, duplicateMatchPercent: null },
  { id: "CLM-1005", customerId: "CUS-004", customerName: "Sneha Reddy", type: "Health", amount: 175000, riskScore: 38, status: "Settled", dateSubmitted: "2025-01-05", description: "Outpatient cataract surgery procedure.", ipLocation: "Hyderabad, India", passwordChangedRecently: false, treatmentCode: "OPH-5502", duplicateClaimId: null, duplicateMatchPercent: null },
  { id: "CLM-1006", customerId: "CUS-005", customerName: "Vikram Singh", type: "Motor", amount: 340000, riskScore: 71, status: "Rejected", dateSubmitted: "2025-02-20", description: "Total loss claim for Hyundai Creta after collision.", ipLocation: "Lagos, Nigeria", passwordChangedRecently: true, treatmentCode: "MOT-1108", duplicateClaimId: "CLM-0912", duplicateMatchPercent: 95 },
  { id: "CLM-1007", customerId: "CUS-006", customerName: "Ananya Iyer", type: "Life", amount: 5000000, riskScore: 55, status: "Pending", dateSubmitted: "2025-02-28", description: "Term life insurance maturity claim.", ipLocation: "Chennai, India", passwordChangedRecently: false, treatmentCode: "LIFE-6601", duplicateClaimId: null, duplicateMatchPercent: null },
  { id: "CLM-1008", customerId: "CUS-007", customerName: "Karan Mehta", type: "Health", amount: 98000, riskScore: 15, status: "Settled", dateSubmitted: "2025-01-18", description: "Dental implant procedure at local clinic.", ipLocation: "Pune, India", passwordChangedRecently: false, treatmentCode: "DENT-7703", duplicateClaimId: null, duplicateMatchPercent: null },
  { id: "CLM-1009", customerId: "CUS-008", customerName: "Deepika Nair", type: "Property", amount: 890000, riskScore: 88, status: "Pending", dateSubmitted: "2025-03-02", description: "Fire damage claim for residential apartment.", ipLocation: "Kochi, India", passwordChangedRecently: true, treatmentCode: "PROP-4425", duplicateClaimId: "CLM-0950", duplicateMatchPercent: 91 },
  { id: "CLM-1010", customerId: "CUS-009", customerName: "Arjun Deshmukh", type: "Health", amount: 312000, riskScore: 60, status: "Rejected", dateSubmitted: "2025-02-05", description: "Spinal surgery claim with incomplete documentation.", ipLocation: "Nagpur, India", passwordChangedRecently: false, treatmentCode: "ORTH-3305", duplicateClaimId: null, duplicateMatchPercent: null },
];

export const kpiData = {
  kycComplete: customers.filter(c => c.kycStatus === "Complete").length,
  kycPending: customers.filter(c => c.kycStatus === "Pending").length,
  totalCustomers: customers.length,
  claimsPending: claims.filter(c => c.status === "Pending").length,
  claimsRejected: claims.filter(c => c.status === "Rejected").length,
  claimsSettled: claims.filter(c => c.status === "Settled").length,
};
