var Restaurant = require('../models/restaurant');
var mongoose = require('mongoose');
var EARTH_RADIUS = 6378137.0;

function getRadius(d){
    return d*Math.PI/180.0;
}

/**
 * Calculate the distance between two locations
 * @param lat1
 * @param lng1
 * @param lat2
 * @param lng2
 * @returns {number} distance number (m)
 */
function getDistance(lat1,lng1,lat2,lng2) {
    var radiusLat1 = getRadius(lat1);
    var radiusLat2 = getRadius(lat2);

    var x = radiusLat1 - radiusLat2;
    var y = getRadius(lng1) - getRadius(lng2);

    var result = 2*Math.asin(
        Math.sqrt(
            Math.pow(Math.sin(x/2),2) + Math.cos(radiusLat1) * Math.cos(radiusLat2) * Math.pow(Math.sin(y/2),2)
        )
    );

    result = result*EARTH_RADIUS;
    result = Math.round(result*10000)/10000.0;
    return result;
}

/**
 *  Get restaurant id from restaurant collection
 * @param req
 * @param res
 */
exports.getRestaurantByID = function (req,res) {
    var data = req.body;
    var id = mongoose.Types.ObjectId(data['id']);
    try{
        Restaurant.findById(id,
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
 *  Search function by keywords
 * @param req
 * @param res
 */
exports.getSearchedRestaurant=function (req,res) {
    var userData=req.body;
    if (userData==null){
        res.status(403).send('No data sent!')
    }

    try {
        Restaurant.find(
            {
                $and:[ {
                    $or:[
                        {postcode:{$regex:userData.keyword,$options:"$i"}},
                        {name:{$regex:userData.keyword,$options:"$i"}},
                        {cuisine:{$regex:userData.keyword,$options:"$i"}},
                        {address:{$regex:userData.keyword,$options:"$i"}},
                        {borough:{$regex:userData.keyword,$options:"$i"}},

                    ]},
                    {postcode:{$regex:userData.postcode,$options:"$i"}},
                    {cuisine:{$regex:userData.cuisine,$options:"$i"}}
                ]

            },
            function (err,mycollection) {
                if (err)
                    res.status(500).send('Invalid data!');

                res.setHeader('Content-Type', 'application/json');
                res.send(mycollection);
            });

    }catch (e) {
        res.status(500).send('error ' + e);
    }
};
/**
 * Search function by map
 * @param req
 * @param res
 */
exports.getAroundRestaurant = function (req,res) {
    var data=req.body;
    if (data==null){
        res.status(403).send('No data sent!')
    }

    try{
        Restaurant.find(
                {postcode:{$regex:'',$options:"$i"}},
                function (err, mycollection) {
                    if (err)
                        res.status(500).send('Invalid data!');
                    var results = [];
                    for (var i = 0; i<mycollection.length; i++){
                        var dis = getDistance(data['latitude'],data['longitude'],
                            mycollection[i]['latitude'],mycollection[i]['longitude']);
                        console.log(dis);
                        if(dis <= data['max-distance']){
                            results.push(mycollection[i]);
                        }
                    }
                    res.setHeader('Content-Type', 'application/json');
                    res.send(results);
                });
    }
    catch (e){
        res.status(500).send('error ' + e);
    }
};

/**
 * Get average rating score
 * @param req
 * @param res
 */
exports.updateRating = function (req, res) {
    var userData=req.body;
    if (userData==null){
        res.status(403).send('No data sent!')
    }
    try {
        Restaurant.update({name: userData['name']},{$set:{rating:userData['rating']}},{safe:true},function (err, results) {
            if (err)
                res.status(500).send('Invalid data!');
                var respData = {};
                respData['result'] = 'success';
                res.setHeader('Content-Type', 'application/json');
                res.send(respData);
        });
    } catch (e) {
        res.status(500).send('error ' + e);
    }

};
/**
 *  Add a new restaurant
 * @param req
 * @param res
 */
exports.insertRestaurant = function (req, res) {
    var userData = req.body;
    var restaurant_name=userData.name;

    if (userData == null) {
        res.status(403).send('No data sent!')
    }

    try {
        Restaurant.findOne({name:restaurant_name},function (err,doc) {
            var respData = {};
            if (err)
                res.status(500).send('Invalid data!');
            if (doc != null){
                respData['result'] = 'Existing Restaurant';
            }
            else {
                var restaurant = new Restaurant({
                    name: userData.name,
                    description:userData.description,
                    address: userData.address,
                    postcode:userData.postcode,
                    borough:userData.borough,
                    cuisine:userData.cuisine,
                    phone:userData.phone,
                    features:userData.features,
                    longitude:userData.longitude,
                    latitude:userData.latitude,
                    openhours:userData.openhours,
                    rating:userData.rating,
                    image:userData.image
                });
                restaurant.save(function (err, results) {
                    if (err)
                        res.status(500).send('Invalid data!');
                    respData['result'] = 'success';
                    res.setHeader('Content-Type', 'application/json');
                    res.send(respData);
                });
            }

        })

    } catch (e) {
        res.status(500).send('error ' + e);
    }
};
