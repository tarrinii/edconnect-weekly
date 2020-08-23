const mongoose = require('../db');
const Schema = mongoose.Schema;

const ProgramSchema = new Schema({
    name: { type: String, required: true }
})

const Program = mongoose.model('program', ProgramSchema);

module.exports = Program;