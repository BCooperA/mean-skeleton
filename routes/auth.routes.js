var     router          = require('express').Router(),
        mongoose        = require('mongoose'),
        User            = mongoose.model('User'),
        passport        = require('passport'),
        cookieParser    = require('cookie-parser'),
        randtoken       = require('rand-token');

/**
 * *********************************************************************
 *  Local Authentication
 *  Signs user in using Passport's "Local Strategy"
 * **********************************************************************
 */
router.post('/signin', function(req, res, next) {
    if(!req.body.user.email){
        return res.status(422).json({ errors: { email: "can't be blank" } });
    }

    if(!req.body.user.password){
        return res.status(422).json({ errors: { password: "can't be blank" } });
    }

    passport.authenticate('local', { session: false }, function(err, user, info) {
        if(err) {
            next(err);
        }
        if(user) {
            // account is not activated
            if(user.activation_token !== '' || user.active === 0) {
                return res.status(422).json({ errors: { user: 'Account is not been activated.' } });
            }

            // generate JSWON web token to user
            user.token = user.generateJWT();
            return res.json({ user: user.toAuthJSON() });
        } else {
            return res.status(422).json(info);
        }
    })(req, res, next);
});


/**
 * *********************************************************************
 *
 *  Social Authentication
 *
 *  Facebook Authentication
 * **********************************************************************
 */
router.get('/signin/facebook', passport.authenticate('facebook', {
    scope: [ 'email', 'public_profile' ]
}), function(req, res){});

router.get('/signin/facebook/callback', function(req, res, next) {
    passport.authenticate('facebook', { scope : ['email', 'public_profile'], session: false, failureRedirect: '/'}, function (err, user) {

        // The token we have created on FacebookStrategy above
        user.token = user.generateJWT();

        var userCookie = JSON.stringify({
            'id': user._id,
            'token': user.token
        });

        // send user data as JSON in cookie and redirect
        res.cookie('user', userCookie);
        res.redirect('/');
    })(req, res, next);
});

/**
 * *********************************************************************
 *  Twitter Authentication
 * **********************************************************************
 */
router.get('/signin/twitter', passport.authenticate('twitter'),
    function(req, res){});

// handle the callback after twitter has authenticated the user
router.get('/signin/twitter/callback', function(req, res, next) {
    passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }, function (err, user) {
        // The token we have created on FacebookStrategy above
        user.token = user.generateJWT();

        var userCookie = JSON.stringify({
            'id': user._id,
            'token': user.token
        });

        // send user data as JSON in cookie and redirect
        res.cookie('user', userCookie);
        res.redirect('/');
    })(req, res, next);
});

/**
 * *********************************************************************
 *  Google Authentication
 * **********************************************************************
 */
router.get('/signin/google', passport.authenticate('google', { scope: [
        'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/plus.profile.emails.read'
    ]}), function(req, res) {});

router.get('/signin/google/callback', function(req, res, next) {
    passport.authenticate('google', { failureRedirect: '/login' }, function(err, user) {
        // The token we have created on FacebookStrategy above
        console.log(user);

        if(err)
            return next(err);

        user.token = user.generateJWT();
        var userCookie = JSON.stringify({
            'id': user._id,
            'token': user.token
        });

        // send user data as JSON in cookie and redirect
        res.cookie('user', userCookie);
        res.redirect('/');
    })(req, res, next);
});


/**
 * *********************************************************************
 *  Activate user
 * **********************************************************************
 */
router.get('/activate/:activation_token', function(req, res, next) {
    if(!req.params.activation_token){
        return res.status(422).json({ errors: { activation_token:  'activation token not found'} });
    }

    //
    User.findOne({ activation_token: new RegExp('^'+ req.params.activation_token +'$', "i")}, function( err, user ) {
        if (err)
            return next(err);
        // console.log(user);

        user.activation_token = '';
        user.active = 1;
        user.save();

        return res.redirect('/');

    }).catch(next);
});

/**
 * *********************************************************************
 *  Password recovery request
 * **********************************************************************
 */
router.put('/password/recover', function(req, res, next) {
    User.findOne({email: new RegExp('^'+ req.body.user.email +'$', "i")}, function(err, user) {
        if(err)
        // handle errors
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
 * *********************************************************************
 *  Password reset request
 * **********************************************************************
 */
router.put('/password/reset/:password_request_token', function(req, res, next) {
    User.findOne({ request_password_token: new RegExp('^'+ req.params.password_request_token +'$', "i")}, function(err, user) {
        if(err)
        // handle errors
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
