const passport         = require('passport')
    , authProviders    = require('./index.js').authProviders
    , mongoose         = require('mongoose')
    , User             = mongoose.model('User')
    , LocalStrategy    = require('passport-local').Strategy
    , FacebookStrategy = require('passport-facebook').Strategy
    , TwitterStrategy  = require('passport-twitter').Strategy
    , GoogleStrategy   = require('passport-google-oauth20').Strategy;

/**
 |--------------------------------------------------------------------------
 | Passport Strategies
 |--------------------------------------------------------------------------
 |
 | Here we declare all our authentication strategies
 | Local authentication is handled with e-mail address instead of username
 | Currently supporting SocialAuth for Facebook, Twitter and Google but it is easy to extend
 | and add more services (i.e. Github)
 |
 */

/**
 |--------------------------------------------------------------------------
 | Serialize & deserialize users
 |--------------------------------------------------------------------------
 | If you are using sessions you have to provide passport with a serialize and deserialize function.
 | See: https://stackoverflow.com/a/19283692/2411636
 |--------------------------------------------------------------------------
 */
passport.serializeUser(function(user, done) {
    done(null, user._id);
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user){
        done(err, user);
    });
});

/**
 |--------------------------------------------------------------------------
 | Local authentication strategy (email, password)
 |--------------------------------------------------------------------------
 */
passport.use(new LocalStrategy({usernameField: 'user[email]', passwordField: 'user[password]' },
    function(email, password, done) {
        User.findOne( { email: email } )
            .then(function(user) {
                if(!user || !user.validPassword(password)){
                    return done(null, false, { errors: {'email or password': 'is invalid' }});
                }
                return done(null, user);
            }).catch(done);
    }));

/**
 |--------------------------------------------------------------------------
 | Social authentication strategy - Facebook
 |--------------------------------------------------------------------------
 */
passport.use(new FacebookStrategy(authProviders.facebook,
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            // search for user in the database based on "oAuth" ID returned by facebook
            User.findOne({
                '$or': [{
                    'auth.oauthID': profile.id,
                    'auth.provider': 'facebook'
                }, {
                    'email': profile.emails[0].value
                }]
            }, function(err, user) {
                if(err) {
                    return done(err);
                }

                if (user) {
                    // if user is found in the database
                    return done(null, user);
                } else {
                    // if user is not found, create a new user based on their Facebook account info
                    user = new User({
                        'auth.provider': 'facebook',
                        'auth.oauthID': profile.id,
                        'name': profile._json.first_name + ' ' + profile._json.last_name,
                        'email': profile.emails[0].value,
                        'image': profile.photos[0].value,
                        'active': 1
                    });

                    // save user in the database
                    user.save(function(err) {
                        if(err) {
                            return done(err);
                        } else {
                            return done(null, user);
                        }
                    });
                }
            });
        });
    }));

/**
 |--------------------------------------------------------------------------
 | Social authentication strategy - Twitter
 |--------------------------------------------------------------------------
 */
passport.use(new TwitterStrategy(authProviders.twitter,
    function(token, tokenSecret, profile, done) {
        process.nextTick(function() {
            User.findOne({
                '$or': [{
                    'auth.oauthID': profile.id,
                    'auth.provider': 'twitter'
                }, {
                    'email': profile.emails[0].value
                }]
            }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {
                    // if user is found then log them in
                    return done(null, user);
                }  else {
                    // if user is not found, create a new user based on their Twitter account info
                    user = new User({
                        'auth.provider': 'twitter',
                        'auth.oauthID': profile.id,
                        'name': profile.displayName,
                        'image': profile._json.profile_image_url_https.slice(this.length, -11) + '.jpg',
                        'email': profile.emails[0].value,
                        'active': 1
                    });

                    // save user in the database
                    user.save(function (err) {
                        if (err) {
                            return done(err);
                        } else {
                            return done(null, user);
                        }
                    });
                }
            });
        });
    }));

/**
 |--------------------------------------------------------------------------
 | Social authentication strategy - Google
 |--------------------------------------------------------------------------
 */
passport.use(new GoogleStrategy(authProviders.google,
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            User.findOne({
                    '$or': [{
                        'auth.oauthID': profile.id,
                        'auth.provider': 'google'
                    }, {
                        'email': profile.emails[0].value
                    }]
                }, function (err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        // if user is found then log them in
                        return done(null, user);
                    } else {
                        // if user is not found, create a new user based on their Google account info
                        user = new User({
                            'auth.provider': 'google',
                            'auth.oauthID': profile.id,
                            'name': profile.displayName,
                            'name': profile.photos[0].value.slice(0, -2) + '200',
                            'email': profile.emails[0].value,
                            'active': 1
                        });

                        // save user in the database
                        user.save(function (err) {
                            if (err) {
                                return done(err);
                            } else {
                                return done(null, user);
                            }
                        });
                    }
                });
        });
    }
));