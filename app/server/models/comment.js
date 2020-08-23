const mongoose = require('../db');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    message: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }
}, { timestamps: true })

const Comment = mongoose.model('comment', CommentSchema);

module.exports = Comment;