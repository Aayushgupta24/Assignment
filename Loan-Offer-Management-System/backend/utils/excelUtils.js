const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

const loadExcelData = () => {
  const filePath = path.join(__dirname, "../data/Calculation.xlsx");

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(
      "Calculation.xlsx not found. Please run npm run create-sample-data first."
    );
  }

  try {
    const workbook = XLSX.readFile(filePath);

    // Verify all required sheets exist
    const requiredSheets = [
      "Recent Loan Offers",
      "Lender Criteria",
      "CalcMatrix_v2",
    ];
    for (const sheet of requiredSheets) {
      if (!workbook.Sheets[sheet]) {
        throw new Error(`Required sheet "${sheet}" not found in Excel file`);
      }
    }

    // Read different sheets
    const recentLoans = XLSX.utils.sheet_to_json(
      workbook.Sheets["Recent Loan Offers"]
    );
    const lenderCriteria = XLSX.utils.sheet_to_json(
      workbook.Sheets["Lender Criteria"]
    );
    const calcMatrix = XLSX.utils.sheet_to_json(
      workbook.Sheets["CalcMatrix_v2"]
    );

    return {
      recentLoans,
      lenderCriteria,
      calcMatrix,
    };
  } catch (error) {
    console.error("Error loading Excel data:", error);
    throw new Error(
      "Failed to load Excel data. Please check the file format and try again."
    );
  }
};

const calculateMonthlyRepayment = (loanAmount, interestRate, term) => {
  return (loanAmount * (1 + interestRate)) / term;
};

const calculateProfitability = (netAssets, prevAssets) => {
  return netAssets - prevAssets;
};

module.exports = {
  loadExcelData,
  calculateMonthlyRepayment,
  calculateProfitability,
};
