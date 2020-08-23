const Program = require('../models/program');

const program = {};

program.getAll = () => {
    return Program.find({}).exec();
}

module.exports = program;