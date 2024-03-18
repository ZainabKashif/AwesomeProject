const mongoose = require('mongoose');

const ComparingCasesSchema = new mongoose.Schema({
    Year: { type: Number, required: true },
    Killed: { type: Number, required: true },
    // Raped: { type: Number, required: true },
    // HonourKilling: { type: Number, required: true },
    // Kidnapped: { type: Number, required: true },
    // GangRape: { type: Number, required: true }
});


const ComparingCases = mongoose.model('ComparingCases', ComparingCasesSchema);

module.exports = ComparingCases;
