// models/TrendingCase.js

const mongoose = require('mongoose');

const femaleJudgesSchema = new mongoose.Schema({
  category: { type: String, required: true },
  value: { type: Number, required: true }
});

const FemaleJudges = mongoose.model('FemaleJudges',femaleJudgesSchema);

module.exports = FemaleJudges;
