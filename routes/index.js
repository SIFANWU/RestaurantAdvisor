var express = require('express');
var router = express.Router();
var restaurant = require('../controllers/restaurant');
var review = require('../controllers/review');
var user = require('../controllers/user');
var server = require('http').Server(express);
var io = require('socket.io')(server);
server.listen(80);

/**
 * all router post and get function
 */

router.get('/', function(req, res) {
    res.render('index');
});
router.get('/login',function (req,res) {
    res.render('login');
});

router.post('/login',function (req,res) {
    res.render('login');
});

router.get('/register',function (req,res,next) {
    res.render('register');
});

router.post('/register',function (req,res,next) {
    res.render('register');
});

router.get('/restaurant',function (req,res) {
    res.render('restaurant');
});

router.get('/addrestaurant',function (req,res) {
    res.render('addrestaurant');
});

router.post('/addrestaurant',function (req,res) {
    res.render('addrestaurant');
});

io.on('connection', review.insertReview);

router.post('/update-rating',restaurant.updateRating);

router.post('/attempt-login', user.login);

router.post('/attempt-register',user.register);

router.post('/getSearchedRestaurant', restaurant.getSearchedRestaurant);

router.post('/getAroundRestaurant', restaurant.getAroundRestaurant);

router.post('/getRestaurant', restaurant.getRestaurantByID);

router.post('/getReviews', review.getReviewsById);

router.post('/addNewRestaurant', restaurant.insertRestaurant);

module.exports = router;
