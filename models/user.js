var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var User = new Schema(
    {
        username:{type: String,unique: true},
        password:{type:String}
    }
);


var  userModel = mongoose.model('Users', User,'users');
module.exports = userModel;