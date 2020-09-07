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
const requireLogin = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401)
        res.json({
            status: 'error',
            message: 'Unauthorized Access'
        })
    }
}
const upload = multer({
    storage: storage
});

api.get('/api/programs', (req, res) => {
    program.getAll()
        .then(response => res.json(response));
});

api.get('/api/users/:id', (req, res) => {
    user.getById(req.params.id)
        .then(response => res.json(response));
});

const handleError = (err, res) => {

    res.status(400)
    if (err.errors) {
        res.json({
            status: 'error',
            messages: Object.keys(err.errors).map(key => {
                return {
                    field: key,
                    error: err.errors[key].message
                }
            })
        })
    } else if (typeof err === 'object') {
        res.json({
            status: 'error',
            messages: [err.message]
        })
    } else {
        res.json({
            status: 'error',
            messages: [err]
        })
    }
}

api.post('/api/projects', requireLogin, (req, res) => {
    const {
        name,
        abstract,
        authors,
        tags
    } = req.body;
    project.submit(name, abstract, authors, tags, req.session.user._id)
        .then(data => {
            const [project, error] = data;
            if (project) {
                res.json(project)
            }
            handleError(error, res)
        });
});


api.post('/api/login', (req, res) => {
    const {
        email,
        password
    } = req.body;
    user.authenticate(email, password)
        .then(data => {
            const [user, error] = data;
            if (user) {
                req.session.user = user;
                res.json(user);
            }
            handleError(error, res)

        });
});
api.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({
        status: 'success'
    })
});

api.post('/api/users', (req, res) => {
    const {
        firstname,
        lastname,
        email,
        password,
        matricNumber,
        program,
        graduationYear
    } = req.body;
    user.register(firstname, lastname, email, password, matricNumber, program, graduationYear)
        .then(data => {
            console.log(data)
            const [user, error] = data;
            if (user) {
                req.session.user = user;
                res.json(data);
            }
            handleError(error, res)
        })
});

api.post('/api/project/search', (req, res) => {
    const {
        search,
        type
    } = req.body;
    project.getSearchResults(search, type)
        .then(response => res.json(response));
});

api.get('/api/projects/showcase', (req, res) => {
    project.getLast4()
        .then(response => res.json(response));
});

api.get('/api/projects/:id', (req, res) => {
    project.getById(req.params.id)
        .then(response => {
            if(response) {
                res.json(response)
            } else {
                res.status(404)
                res.json({
                    status: 'error',
                    message: `Project with id ${req.params.id} not found.`
                })
            }

        });
});

api.delete('/api/projects/:id/file', (req, res) => {
    attachment.deleteById(req.params.id)
        .then(response => res.json(response));
});

api.post('/api/projects/:id/files', upload.array('file'), function (req, res) {
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

api.post('/api/projects/:id/comment', (req, res) => {
    const {
        message
    } = req.body;
    comment.create(message, req.session.user._id)
        .then(value => project.addComment(req.params.id, value))
        .then(response => res.json(response));
});

api.delete('/api/projects/:id/comment', (req, res) => {
    comment.deleteById(req.params.id)
        .then(response => res.json(response));
});

module.exports = api;