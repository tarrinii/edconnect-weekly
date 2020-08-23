const express = require('express');
const router = express.Router();
const user = require('../controllers/user');
const project = require('../controllers/project');

const requireLogin = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

const getFlashString = (data) => {
    if (data.length > 0) {
        if (typeof data[0] === 'object') {
            return JSON.stringify(data[0]);
        }
        return data[0];
    }
    return '';
}

router.get('/', (req, res) => {
    res.render('index', { user: req.session.user });
});

router.get('/login', (req, res) => {
    res.render('user/login', {
        user: req.session.user,
        error: getFlashString(req.flash('error'))
    });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    user.authenticate(email, password)
        .then(data => {
            const [user, error] = data;
            if (user) {
                req.session.user = user;
                return res.redirect('/');
            }
            req.flash('error', error);
            res.redirect('/login');
        });
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.get('/signup', (req, res) => {
    res.render('user/signup', {
        user: req.session.user,
        error: getFlashString(req.flash('error'))
    });
});

router.post('/signup', (req, res) => {
    const { firstname, lastname, email, password, matricNumber, program, graduationYear } = req.body;
    user.register(firstname, lastname, email, password, matricNumber, program, graduationYear)
        .then(data => {
            const [user, error] = data;
            if (user) {
                req.session.user = user;
                return res.redirect('/');
            }
            req.flash('error', error);
            res.redirect('/signup');
        });
});

router.get('/profile', requireLogin, (req, res) => {
    res.render('user/profile', {
        user: req.session.user,
        profileSuccess: getFlashString(req.flash('profile_success')),
        profileError: getFlashString(req.flash('profile_error')),
        passwordSuccess: getFlashString(req.flash('password_success')),
        passwordError: getFlashString(req.flash('password_error'))
    });
});

router.post('/profile', requireLogin, (req, res) => {
    const { firstname, lastname, email, matricNumber, program, graduationYear } = req.body;
    user.update(req.session.user._id, firstname, lastname, email, matricNumber, program, graduationYear)
        .then(data => {
            const [user, error] = data;
            if (user) {
                req.flash('profile_success', 'Profile has been updated');
                req.session.user = user;
                req.session.save(() => {
                    req.session.reload(() => {
                        res.redirect('/profile');
                    });
                });
            } else {
                req.flash('profile_error', error);
                res.redirect('/profile');
            }
        });
});

router.post('/password', requireLogin, (req, res) => {
    const { password, new_password, confirm_password } = req.body;
    user.changePassword(req.session.user._id, password, new_password, confirm_password)
        .then(data => {
            const [user, error] = data;
            if (user) {
                req.flash('password_success', 'New password has been saved');
            } else {
                req.flash('password_error', error);
            }
            res.redirect('/profile');
        });
});

router.get('/projects', (req, res) => {
    const { search, type } = req.query;
    res.render('project/gallery', {
        user: req.session.user,
        search,
        type
    });
});

router.get('/projects/submit', requireLogin, (req, res) => {
    res.render('project/submit', {
        user: req.session.user,
        error: getFlashString(req.flash('error'))
    });
});

router.post('/projects/submit', requireLogin, (req, res) => {
    const { name, abstract, authors, tags } = req.body;
    project.submit(name, abstract, authors, tags, req.session.user._id)
        .then(data => {
            const [project, error] = data;
            if (project) {
                res.redirect(`/projects/${project._id}/edit`);
            }
            req.flash('error', error);
            res.redirect('/projects/submit');
        });
});

router.get('/projects/:id/edit', requireLogin, (req, res) => {
    res.render('project/edit', {
        user: req.session.user,
        id: req.params.id,
        success: getFlashString(req.flash('success')),
        error: getFlashString(req.flash('error'))
    });
});

router.get('/projects/:id/view', (req, res) => {
    res.render('project/view', {
        user: req.session.user,
        id: req.params.id
    });
});

router.post('/projects/edit', requireLogin, (req, res) => {
    const { id, name, abstract, authors, tags } = req.body;
    project.edit(id, name, abstract, authors, tags)
        .then(data => {
            const [project, error] = data;
            if (project) {
                req.flash('success', 'Project data has been saved');
            } else {
                req.flash('error', error);
            }
            res.redirect(`/projects/${project._id}/edit`);
        });
});

router.get('/download/:path', function(req, res){
    const file = `${__dirname}/../uploads/${req.params.path}`;
    res.download(file);
});

router.get('*', (req, res) => {
    res.render('notFound', { user: req.session.user });
});

module.exports = router;