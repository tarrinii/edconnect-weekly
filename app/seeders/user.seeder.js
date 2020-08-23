const Seeder = require('mongoose-data-seed').Seeder;
const User = require('../server/models/user');
const Program = require('../server/models/program');

class UserSeeder extends Seeder {
    async beforeRun() {
        this.programs = await Program.find({}).exec();
    }
    
    async shouldRun() {
        return User.countDocuments()
            .exec()
            .then(count => count === 0);
    }

    async run() {
        const admin = new User();

        admin.firstname = 'John';
        admin.lastname = 'Doe';
        admin.email = 'johndoe@gmail.com';
        admin.matricNumber = '16/0823';
        admin.graduationYear = '2020';
        admin.program = this.programs[0];
        admin.setPassword('admin');

        return admin.save();
    }
}

exports.default = UserSeeder;
