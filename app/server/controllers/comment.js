const Comment = require('../models/comment');

const comment = {};

comment.create = (message, createdBy) => {
    const comment = new Comment();
    
    comment.message = message;
    comment.createdBy = createdBy;

    return comment.save()
        .then(comment => {
            return comment._id;
        })
        .catch(error => error);
}

comment.deleteById = (id) => {
    return Comment.deleteOne({ _id: id }).exec();
}

module.exports = comment;