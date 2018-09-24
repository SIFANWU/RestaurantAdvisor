var mongoose = require('mongoose');
var init= require('../controllers/init');

//The URL which will be queried. Run "mongod.exe" for this to connect
var mongoDB = 'mongodb://localhost:27017/mydb';

/**
 * Connect the MongoDB
 *
 */
mongoose.Promise = global.Promise;
mongoose.connect(mongoDB);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/**
 * initialize all restaurants and users
 */
init.init();
