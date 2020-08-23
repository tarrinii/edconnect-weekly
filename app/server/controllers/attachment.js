const Attachment = require('../models/attachment');

const attachment = {};

attachment.create = (name, mimetype) => {
    const attachment = new Attachment();
    
    attachment.name = name;
    attachment.mimetype = mimetype;

    return attachment.save()
        .then(attachment => {
            return attachment._id;
        })
        .catch(error => error);
}

attachment.deleteById = (id) => {
    return Attachment.deleteOne({ _id: id }).exec();
}

module.exports = attachment;