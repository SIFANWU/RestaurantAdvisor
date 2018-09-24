var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Review = new Schema(
    {
        username:{type: String},
        rating:{type: String},
        review:{type: String},
        date:{type: String},
        restaurantid:{type: String},
        image:{type:String}
    }
);


var reviewModel = mongoose.model('Reviews', Review,'reviews');
module.exports = reviewModel;