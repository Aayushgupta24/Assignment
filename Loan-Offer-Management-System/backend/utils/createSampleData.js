const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

// Sample data for each sheet
const recentLoans = [
  {
    companyName: "Company A",
    loanAmount: 100000,
    interestRate: 0.08,
    term: 24,
    monthlyRepayment: 4500,
  },
  {
    companyName: "Company B",
    loanAmount: 200000,
    interestRate: 0.09,
    term: 36,
    monthlyRepayment: 6300,
  },
];

const lenderCriteria = [
  {
    name: "Lender A",
    minAssets: 100000,
    maxLoan: 500000,
    interestRate: 0.08,
    term: 24,
    preferredTier: "Tier 1",
  },
  {
    name: "Lender B",
    minAssets: 200000,
    maxLoan: 800000,
    interestRate: 0.09,
    term: 36,
    preferredTier: "Tier 2",
  },
  {
    name: "Lender C",
    minAssets: 50000,
    maxLoan: 300000,
    interestRate: 0.07,
    term: 12,
    preferredTier: "Tier 3",
  },
];

const calcMatrix = [
  {
    tier: "Tier 1",
    minNetAssets: 500000,
    minAge: 5,
    minProfitability: 100000,
  },
  {
    tier: "Tier 2",
    minNetAssets: 200000,
    minAge: 2,
    minProfitability: 50000,
  },
  {
    tier: "Tier 3",
    minNetAssets: 50000,
    minAge: 1,
    minProfitability: 10000,
  },
];

// Create workbook
const workbook = XLSX.utils.book_new();

// Convert data to worksheets
const recentLoansSheet = XLSX.utils.json_to_sheet(recentLoans);
const lenderCriteriaSheet = XLSX.utils.json_to_sheet(lenderCriteria);
const calcMatrixSheet = XLSX.utils.json_to_sheet(calcMatrix);

// Add worksheets to workbook
XLSX.utils.book_append_sheet(workbook, recentLoansSheet, "Recent Loan Offers");
XLSX.utils.book_append_sheet(workbook, lenderCriteriaSheet, "Lender Criteria");
XLSX.utils.book_append_sheet(workbook, calcMatrixSheet, "CalcMatrix_v2");

// Ensure data directory exists
const dataDir = path.join(__dirname, "../data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Write to file
XLSX.writeFile(workbook, path.join(dataDir, "Calculation.xlsx"));

console.log("Sample Excel file created successfully!");
