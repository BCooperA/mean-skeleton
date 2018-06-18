const   router          = require('express').Router(),
        mongoose        = require('mongoose'),
        User            = mongoose.model('User'),
        randtoken       = require('rand-token');

/**
 |--------------------------------------------------------------------------
 | Account routes
 |--------------------------------------------------------------------------
 |
 | This file is where you may define all of your account based routes, including
 | e-mail verification, routes for recovering and reseting user password
 |
 */


/**
 |--------------------------------------------------------------------------
 | E-mail verification
 |--------------------------------------------------------------------------
 | Route to check if e-mail address already found in the database
 */
router.post('/email', function(req, res, next) {
    User.findOne({ email: req.body.user.email }, function(err, user) {
        if(err) {
            next(err);
        }
        // return valid based on the user object
        return res.status(200).json({ valid: (user) ? false : true });
    });
});


/**
 |--------------------------------------------------------------------------
 | Activate user
 |--------------------------------------------------------------------------
 | Activates user's account after user has clicked a link mailed to him/her
 */
router.get('/activate/:activation_token', function(req, res, next) {
    if(!req.params.activation_token){
        return res.status(422).json({ errors: { activation_token:  'activation token not found'} });
    }

    User.findOne({ activation_token: new RegExp('^'+ req.params.activation_token +'$', "i")}, function( err, user ) {
        if (err)
            return next(err);

        user.activation_token = '';
        user.active = 1;
        user.save();

        return res.redirect('/account/login');

    }).catch(next);
});

/**
 |--------------------------------------------------------------------------
 | Password recovery request
 |--------------------------------------------------------------------------
 | Generates a random recovery token for user and saves it
 */
router.put('/password/recover', function(req, res, next) {
    User.findOne({email: new RegExp('^'+ req.body.user.email +'$', "i")}, function(err, user) {
        if(err)
            return next(err);

        if(!req.body.user.email){
            return res.status(422).json({ errors: { email: "can't be blank" } });
        }

        if(!user) {
            // user was not found by the email address
            return res.status(422).json({ errors: { email: "not found"} });
        } else {
            // generate a request token for password reset
            user.request_password_token = randtoken.generate(32);

            return user.save().then(function(){
                return res.status(200).json({"error": false, "message": "OK"});
            });
        }
    }).catch(next);
});

/**
 |--------------------------------------------------------------------------
 | Password reset request
 |--------------------------------------------------------------------------
 | Resets users password
 */
router.put('/password/reset/:password_request_token', function(req, res, next) {
    User.findOne({ request_password_token: new RegExp('^'+ req.params.password_request_token +'$', "i")}, function(err, user) {
        if(err)
            return next(err);

        if(!user) {
            // invalid token or it does not belong to user
            return res.status(404).json({"error": true, "message": "Invalid token"});
        } else {
            // reset request password token
            user.request_password_token = '';

            // store new passwords hash and salt in the database
            if(typeof req.body.user.password !== 'undefined') {
                user.setPassword(req.body.user.password);
            }

            return user.save().then(function() {
                return res.status(200).json({"error": false, "message": "OK"});
            });
        }
    }).catch(next);
});

module.exports = router;
