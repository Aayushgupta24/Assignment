const mongoose = require("mongoose");

const LoanSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  netAssets: {
    type: Number,
    required: true,
    min: 0,
  },
  prevNetAssets: {
    type: Number,
    required: true,
    min: 0,
  },
  loanAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  interestRate: {
    type: Number,
    required: true,
    min: 0,
  },
  term: {
    type: Number,
    required: true,
    min: 1,
  },
  monthlyRepayment: {
    type: Number,
    required: true,
    min: 0,
  },
  tier: {
    type: String,
    enum: ["Tier 1", "Tier 2", "Tier 3"],
    required: true,
  },
  profitability: {
    type: Number,
    required: true,
  },
  defaultRisk: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  recommendedLenders: [
    {
      name: String,
      interestRate: Number,
      term: Number,
      monthlyRepayment: Number,
      score: Number,
    },
  ],
});

module.exports = mongoose.model("Loan", LoanSchema);
