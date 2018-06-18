const   router          = require('express').Router(),
        mongoose        = require('mongoose'),
        User            = mongoose.model('User'),
        passport        = require('passport'),
        cookieParser    = require('cookie-parser'),
        randtoken       = require('rand-token');

/**
 |--------------------------------------------------------------------------
 | Authentication routes
 |--------------------------------------------------------------------------
 |
 | This file is where you may define all of your auth based routes, including
 | local authentication route and social authentication routes.
 | Note! Authentication strategies are still found in config/passport.js
 |
 */


/**
 |--------------------------------------------------------------------------
 | Local Authentication
 |--------------------------------------------------------------------------
 | Authenticates user using Local Strategy by Passport
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
            if(user.activation_token !== '' || user.active === 0) {
                // account is not activated
                return res.status(422).json({ errors: { user: 'Account is not been activated.' } });
            }

            // generate JSON web token to user
            user.token = user.generateJWT();
            return res.json({ user: user.toAuthJSON() });
        } else {
            return res.status(422).json(info);
        }
    })(req, res, next);
});

/**
 |--------------------------------------------------------------------------
 | Social Authentication - Facebook
 |--------------------------------------------------------------------------
 | Authenticates user using Facebook Strategy by Passport
 */
router.get('/signin/facebook', passport.authenticate('facebook', {
    scope: [ 'email', 'public_profile' ]
}), function(req, res){});

router.get('/signin/facebook/callback', function(req, res, next) {
    passport.authenticate('facebook', { scope : ['email', 'public_profile'], session: false, failureRedirect: '/'},
        function (err, user) {
            if(err)
                return next(err);

            user.token = user.generateJWT();
            var userCookie = JSON.stringify({
                'id': user._id,
                'token': user.token
            });

            // send user data as JSON in cookie and redirect
            res.cookie('user', userCookie);
            res.redirect('/app/dashboard');
        })(req, res, next);
});

/**
 |--------------------------------------------------------------------------
 | Social Authentication - Twitter
 |--------------------------------------------------------------------------
 | Authenticates user using Twitter Strategy by Passport
 */
router.get('/signin/twitter', passport.authenticate('twitter'),
    function(req, res){});

// handle the callback after twitter has authenticated the user
router.get('/signin/twitter/callback', function(req, res, next) {
    passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' },
        function (err, user) {
            if(err)
                return next(err);

            user.token = user.generateJWT();
            var userCookie = JSON.stringify({
                'id': user._id,
                'token': user.token
            });

            // save user data as JSON in cookie and redirect
            res.cookie('user', userCookie);
            res.redirect('/app/dashboard');
        })(req, res, next);
});

/**
 |--------------------------------------------------------------------------
 | Social Authentication - Google
 |--------------------------------------------------------------------------
 | Authenticates user using Google Strategy by Passport
 */
router.get('/signin/google', passport.authenticate('google', { scope: [
        'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/plus.profile.emails.read'
    ]}), function(req, res) {});

router.get('/signin/google/callback', function(req, res, next) {
    passport.authenticate('google', { failureRedirect: '/login' },
        function(err, user) {
            if(err)
                return next(err);

            user.token = user.generateJWT();
            var userCookie = JSON.stringify({
                'id': user._id,
                'token': user.token
            });

            // save user data as JSON in cookie and redirect
            res.cookie('user', userCookie);
            res.redirect('/app/dashboard');
        })(req, res, next);
});

module.exports = router;
