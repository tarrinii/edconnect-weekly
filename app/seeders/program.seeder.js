const Seeder = require('mongoose-data-seed').Seeder;
const Program = require('../server/models/program');

const data = [
    { name: 'Computer Science' },
    { name: 'Computer Technology' },
    { name: 'Computer Information Systems' },
    { name: 'Software Engineering' }
];

class ProgramSeeder extends Seeder {
    async shouldRun() {
        return Program.countDocuments()
            .exec()
            .then(count => count === 0);
    }

    async run() {
        return Program.create(data);
    }
}

exports.default = ProgramSeeder;