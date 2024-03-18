// models/TrendingCase.js

const mongoose = require('mongoose');

const literacyRateSchema = new mongoose.Schema({
  category: { type: String, required: true },
  value: { type: Number, required: true }
});

const LiteracyRate = mongoose.model('LiteracyRate', literacyRateSchema);

module.exports = LiteracyRate;
