const mongoose = require('mongoose');

mongoose.set('bufferCommands', false);
mongoose.Promise = global.Promise;


const port = process.env.MONGO_PORT || 27017
const MONGO_URI = `mongodb://${process.env.MONGO_HOST}:${port}/edconnect`;

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, () => { console.log(`Connected to MongoDB @ ${port}`) }).catch(err => console.log(err));

module.exports = mongoose;