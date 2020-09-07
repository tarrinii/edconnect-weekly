const User = require('../models/user');

const user = {};

user.authenticate = (email, password) => {
    return User.findOne({ email })
        .exec()
        .then(user => {
            if (user && user.validPassword(password)) {
                return [{
                    _id: user._id,
                    displayName: `${user.firstname} ${user.lastname}`
                }];
            }
            return [null, 'Invalid user credential'];
        })
        .catch(error => [null, error]);
}

user.register = (firstname, lastname, email, password, matricNumber, program, graduationYear) => {
    const user = new User();
    
    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;
    user.matricNumber = matricNumber;
    user.graduationYear = graduationYear;
    user.program = program;
    user.setPassword(password);

    return user.save()
        .then(user => {
            return [{
                _id: user._id,
                displayName: `${user.firstname} ${user.lastname}`
            }];
        })
       .catch(error => [null, error]);
}

user.update = (id, firstname, lastname, email, matricNumber, program, graduationYear) => {
    return User.findByIdAndUpdate(id, {
            firstname,
            lastname,
            email,
            matricNumber,
            program,
            graduationYear
        })
        .exec()
        .then(user => {
            return [{
                _id: user._id,
                displayName: `${firstname} ${lastname}`
            }];
        })
        .catch(error => [null, error]);
}

user.changePassword = (id, password, new_password, confirm_password) => {
    if (new_password !== confirm_password) {
        return Promise.resolve([null, 'New password confirmation does not match']);
    }

    return User.findById(id)
        .exec()
        .then(user => {
            if (!user.validPassword(password)) {
                return [null, 'Invalid current password'];
            }
            user.setPassword(new_password);
            return user.save()
                .then(user => {
                    return [{ _id: user._id }];
                });
        })
        .catch(error => [null, error]);
}

user.getById = (id) => {
    return User.findById(id, 'firstname lastname email matricNumber program graduationYear')
        .populate('program')
        .exec();
}

module.exports = user;