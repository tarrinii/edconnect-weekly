const mongoose = require('../db');
const Schema = mongoose.Schema;

const AttachmentSchema = new Schema({
    name: { type: String, required: true },
    mimetype: { type: String, required: true }
}, { timestamps: true })

const Attachment = mongoose.model('attachment', AttachmentSchema);

module.exports = Attachment;