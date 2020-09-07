const mongoose = require('mongoose');

mongoose.set('bufferCommands', false);
mongoose.Promise = global.Promise;

(async () => {

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log(`Connected to mongodb: ${process.env.MONGO_URI}`)
        return conn;
    } catch (error) {
        console.log('Error connecting to db ', error)

    }
})();

module.exports = mongoose;