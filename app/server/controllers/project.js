const Project = require('../models/project');
const Comment = require('../models/comment');
const Attachment = require('../models/attachment');

const project = {};

project.getById = (id) => {
    return Project.findById(id)
        .populate('attachments')
        .populate({
            path: 'comments',
            options: { sort: { 'updatedAt': -1 } },
            populate: {
                path: 'createdBy',
                model: 'user',
                select: '_id, firstname lastname'
            }
        })
        .populate('createdBy', '_id, firstname lastname')
        .exec();
}

project.getLast4 = () => {
    return Project.find({})
        .sort('-updatedAt')
        .limit(4)
        .populate('createdBy', '_id, firstname lastname')
        .exec();
}

project.getSearchResults = (search, type) => {
    const query = search ? { [type.toLowerCase()]: { $regex: search, $options: "i" }} : {}
    return Project.find(query)
        .sort('-updatedAt')
        .populate('createdBy', '_id, firstname lastname')
        .exec();
}

project.submit = (name, abstract, authors, tags, createdBy) => {
    const project = new Project();

    project.name = name;
    project.abstract = abstract;
    project.authors = authors.map(_ => _.trim()).filter(_ => _.length > 0);
    project.tags = tags.map(_ => _.trim()).filter(_ => _.length > 0);
    project.createdBy = createdBy;

    return project.save()
        .then(project => {
            return [project];
        })
        .catch(error => [null, error]);
}

project.edit = (id, name, abstract, authors, tags) => {
    return Project.findByIdAndUpdate(id, {
        name,
        abstract,
        authors: authors.split(',').map(_ => _.trim()).filter(_ => _.length > 0),
        tags: tags.split('#').map(_ => _.trim()).filter(_ => _.length > 0)
    })
        .exec()
        .then(project => {
            return [project];
        })
        .catch(error => [null, error]);
}

project.addAttachments = (id, attachments) => {
    return Project.findById(id)
        .exec()
        .then(project => {
            project.attachments = project.attachments.concat(attachments);
            return project.save()
                .then(project => {
                    return [project];
                });
        })
        .catch(error => [null, error]);
}

project.addComment = (id, comment) => {
    return Project.findById(id)
        .exec()
        .then(project => {
            project.comments.push(comment);
            return project.save()
                .then(project => {
                    return [project];
                });
        })
        .catch(error => [null, error]);
}

module.exports = project;