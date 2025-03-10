const express = require("express");
const router = express.Router();
const Loan = require("../models/Loan");
const {
  loadExcelData,
  calculateMonthlyRepayment,
  calculateProfitability,
} = require("../utils/excelUtils");

// 1️⃣ Clean and Preprocess Data
router.post("/preprocess", async (req, res) => {
  try {
    let { loanAmount, interestRate, term } = req.body;

    // Convert to numbers and set defaults
    loanAmount = Number(loanAmount) || 50000;
    interestRate = Number(interestRate) || 0.1;
    term = Number(term) || 12;

    // Calculate monthly repayment
    const monthlyRepayment = (loanAmount * (1 + interestRate)) / term;

    res.json({
      success: true,
      data: { loanAmount, interestRate, term, monthlyRepayment },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Calculate loan tier based on company data
const calculateTier = (netAssets, age, profitability) => {
  const { calcMatrix } = loadExcelData();

  // Simple tier calculation logic (enhance based on your requirements)
  if (netAssets > 500000 && age > 5 && profitability > 100000) return "Tier 1";
  if (netAssets > 200000 && age > 2 && profitability > 50000) return "Tier 2";
  return "Tier 3";
};

// Enhanced loan matching endpoint
router.post("/match-lenders", async (req, res) => {
  try {
    const excelData = loadExcelData(); // This will now throw proper errors if file is missing
    const { companyName, netAssets, prevNetAssets, loanAmount, companyAge } =
      req.body;

    const profitability = calculateProfitability(netAssets, prevNetAssets);
    const tier = calculateTier(netAssets, companyAge, profitability);

    // Load lender criteria from Excel
    const { lenderCriteria } = excelData;

    // Filter eligible lenders
    let eligibleLenders = lenderCriteria.filter((lender) => {
      return (
        netAssets >= lender.minAssets &&
        loanAmount <= lender.maxLoan &&
        (lender.preferredTier === tier || !lender.preferredTier)
      );
    });

    // Calculate scores and monthly repayments for each lender
    eligibleLenders = eligibleLenders.map((lender) => {
      const monthlyRepayment = calculateMonthlyRepayment(
        loanAmount,
        lender.interestRate,
        lender.term
      );

      // Score based on monthly repayment (lower is better), term length, and amount
      const score =
        (1 / monthlyRepayment) * 0.4 +
        (lender.term / 60) * 0.3 +
        (lender.maxLoan / 1000000) * 0.3;

      return {
        ...lender,
        monthlyRepayment,
        score,
      };
    });

    // Sort by score and get top 3
    eligibleLenders.sort((a, b) => b.score - a.score);
    const topLenders = eligibleLenders.slice(0, 3);

    res.json({
      success: true,
      data: {
        tier,
        profitability,
        recommendedLenders: topLenders,
      },
    });
  } catch (error) {
    console.error("Error in match-lenders:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Add error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || "Something went wrong!",
  });
});

module.exports = router;
