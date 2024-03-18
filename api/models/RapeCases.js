const mongoose = require('mongoose');

const RapeCasesSchema = new mongoose.Schema({
    Year: { type: Number, required: true },
    Raped: { type: Number, required: true },
});


const RapeCases = mongoose.model('RapeCases', RapeCasesSchema);

module.exports = RapeCases;
