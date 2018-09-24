var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Restaurant = new Schema(
    {
        name:{type: String},
        description:{type: String},
        address: {type: String},
        postcode:{type: String},
        borough:{type: String},
        cuisine:{type: String},
        phone:{type: String},
        features:{type: String},
        longitude:{type: String},
        latitude:{type: String},
        openhours:{type: String},
        rating:{type:String},
        image:{type: String}
    }
);

var restaurantModel = mongoose.model('Restaurants', Restaurant,'restaurants');
module.exports = restaurantModel;