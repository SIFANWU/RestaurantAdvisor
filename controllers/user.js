var User = require('../models/user');
/**
 * The user login by searching username from user collection
 * @param req
 * @param res
 */
exports.login = function (req, res) {
    var data = req.body;
    var username = data['username'];
    var password = data['password'];

    try{
        User.findOne({username:username},
            function (err, doc) {
            var respData = {};
                if (err)
                    res.status(500).send('Invalid data!');
                if (doc == null){
                    respData['result'] = 'Invalid User';
                }
                else{
                    var foundPassword = doc['password'];
                    if(foundPassword == password){
                        respData['result'] = 'success'
                    }
                    else{
                        respData['result'] = 'Invalid User';
                    }
                }
                res.setHeader('Content-Type', 'application/json');
                console.log(respData);
                res.send(respData);
            });
    }
    catch (e){
        res.status(500).send('error ' + e);
    }
};
/**
 * Register function when the user doesn't exist
 * @param req
 * @param res
 */
exports.register = function (req, res) {
    var data = req.body;
    var username = data['username'];
    var password = data['password'];
    try{
        User.findOne({username:username},
            function (err, doc) {
                var respData = {};
                if (err)
                    res.status(500).send('Invalid data!');
                if (doc != null){
                    respData['result'] = 'Existing Username';
                }
                else{
                    var user = new User(
                        {
                            username:username,
                            password:password
                        }
                    );
                    user.save(function (err,results) {
                        if (err)
                            res.status(500).send('Invalid data!');
                        console.log(results);
                        respData['result'] = 'success';
                        res.setHeader('Content-Type', 'application/json');
                        res.send(respData);
                    });
                }
            });
    }
    catch (e){
        res.status(500).send('error ' + e);
    }
};