var Review = require('../models/review');
/**
 * Get review id from review collection
 * @param req
 * @param res
 */
exports.getReviewsById = function (req,res){
    var data = req.body;
    var id = data['id'];
    try{
        Review.find({restaurantid:id},
            function (err, doc) {
                if (err)
                    res.status(500).send('Invalid data!');
                res.setHeader('Content-Type', 'application/json');
                res.send(doc);
            });
    }
    catch (e){
        res.status(500).send('error ' + e);
    }
};
/**
 * Insert user comments and pictures
 * @param socket
 */
exports.insertReview = function (socket) {
    socket.on('comment',function (userData) {
        if (userData == null){
            socket.emit('msg','No data sent');
        }
        else{
            try {
                var review = new Review({
                    username:userData.username,
                    rating: userData.rating,
                    review: userData.comment,
                    date: userData.date,
                    restaurantid: userData.restaurantid,
                    image:userData.image
                });
                review.save(function (err, results) {
                    if (err) {
                        socket.emit('msg', 'Error');
                    }
                    else{
                        socket.emit('msg', 'success');
                    }
                });
            } catch (e) {
                socket.emit('msg', 'error '+e);
            }
        }
    });
};
