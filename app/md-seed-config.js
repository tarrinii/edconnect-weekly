const mongoose = require('mongoose');
const Programs = require('./seeders/program.seeder').default;
const Users = require('./seeders/user.seeder').default;

/**
 * Seeders List
 * order is important
 * @type {Object}
 */
exports.seedersList = {
    Programs,
    Users
};

/**
 * Connect to mongodb implementation
 * @return {Promise}
 */
exports.connect = async () => await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

/**
 * Drop/Clear the database implementation
 * @return {Promise}
 */
exports.dropdb = async () => mongoose.connection.db.dropDatabase();