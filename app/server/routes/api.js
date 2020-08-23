const express = require('express');
const api = express.Router();
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const user = require('../controllers/user');
const program = require('../controllers/program');
const project = require('../controllers/project');
const attachment = require('../controllers/attachment');
const comment = require('../controllers/comment');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, Date.now() + '-' + fileName);
    }
})

const upload = multer({ storage: storage });

api.get('/api/program', (req, res) => {
    program.getAll()
        .then(response => res.json(response));
});

api.get('/api/user/:id', (req, res) => {
    user.getById(req.params.id)
        .then(response => res.json(response));
});

api.post('/api/project/search', (req, res) => {
    const { search, type } = req.body;
    project.getSearchResults(search, type)
        .then(response => res.json(response));
});

api.get('/api/project/showcase', (req, res) => {
    project.getLast4()
        .then(response => res.json(response));
});

api.get('/api/project/:id', (req, res) => {
    project.getById(req.params.id)
        .then(response => res.json(response));
});

api.delete('/api/project/:id/file', (req, res) => {
    attachment.deleteById(req.params.id)
        .then(response => res.json(response));
});

api.post('/api/project/:id/files', upload.array('file'), function (req, res) {
    const attachments = [];
    req.files.forEach(file => {
        attachments.push(attachment.create(file.filename, file.mimetype));
    });

    Promise.all(attachments)
        .then(values => {
            return project.addAttachments(req.params.id, values);
        })
        .then(response => res.json(response));
});

api.post('/api/project/:id/comment', (req, res) => {
    const { message } = req.body;
    comment.create(message, req.session.user._id)
        .then(value => project.addComment(req.params.id, value))
        .then(response => res.json(response));
});

api.delete('/api/project/:id/comment', (req, res) => {
    comment.deleteById(req.params.id)
        .then(response => res.json(response));
});

module.exports = api;