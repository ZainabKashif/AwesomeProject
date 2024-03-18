// models/TrendingCase.js

const mongoose = require('mongoose');

const trendingCaseSchema = new mongoose.Schema({
  category: { type: String, required: true },
  value: { type: Number, required: true }
});

const TrendingCase = mongoose.model('TrendingCase', trendingCaseSchema);

module.exports = TrendingCase;
