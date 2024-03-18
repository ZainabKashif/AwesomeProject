// CombinedCasesModel.js
const mongoose = require('mongoose');

// Define a schema for the CombinedCases data
const CombinedCasesSchema = new mongoose.Schema({
    label: { type: String, required: true },
    value: { type: Number, required: true },
    frontColor: { type: String, required: true },
    sideColor: { type: String, required: true },
    topColor: { type: String, required: true }
});

// Create a Mongoose model based on the schema
const CombinedCases = mongoose.model('CombinedCases', CombinedCasesSchema);

module.exports = CombinedCases;
