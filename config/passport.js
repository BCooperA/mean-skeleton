const   passport                    = require('passport'),
        authProviders               = require('./index.js').authProviders,
        mongoose                    = require('mongoose'),
        User                        = mongoose.model('User'),
        LocalStrategy               = require('passport-local').Strategy,
        FacebookStrategy            = require('passport-facebook').Strategy,
        TwitterStrategy             = require('passport-twitter').Strategy,
        GoogleStrategy              = require('passport-google-oauth20').Strategy;
/**
 * *********************************************************************
 *  Serialize & deserialize users
 * **********************************************************************
 */
passport.serializeUser(function(user, done) {
    console.log('serializeUser: ' + user._id);
    done(null, user._id);
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user){
        console.log(user);
        if(!err) done(null, user);
        else done(err, null);
    });
});

/**
 * *********************************************************************
 *  Passport Strategy For Local Authentication (Email, Password)
 * **********************************************************************
 */
passport.use(new LocalStrategy({
    usernameField: 'user[email]',
    passwordField: 'user[password]'
}, function(email, password, done) {
    User.findOne({email: email}).then(function(user){
        if(!user || !user.validPassword(password)){
            // if user is not found
            return done(null, false, { errors: {'email or password': 'is invalid' }});
        }
        return done(null, user);
    }).catch(done);
}));

/**
 * *********************************************************************
 *  Passport Strategy For Facebook
 * **********************************************************************
 */
passport.use(new FacebookStrategy(authProviders.facebook, function(accessToken, refreshToken, profile, done) {

    // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Twitter
    process.nextTick(function() {
        // search for user in the database based on "oAuth" ID returned by facebook
        User.findOne({ 'auth.oauthID': profile.id, 'auth.provider': 'facebook' }, function(err, user) {
            if(err) {
                return done(err);  // handle errors!
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
 * *********************************************************************
 *  Passport Strategy for Twitter
 * **********************************************************************
 */
passport.use(new TwitterStrategy(authProviders.twitter, function(token, tokenSecret, profile, done) {

    // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Twitter
    process.nextTick(function() {
        User.findOne({ 'auth.oauthID' : profile.id, 'auth.provider': 'twitter' }, function(err, user) {
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
 * *********************************************************************
 *  Passport Strategy for Google
 * **********************************************************************
 */
passport.use(new GoogleStrategy(authProviders.google, function(accessToken, refreshToken, profile, done) {

    // make the code asynchronous
        // asynchronous verification, for effect...
        process.nextTick(function () {
            // User.findOne won't fire until we have all our data back from Twitter
            User.findOne({ 'auth.oauthID': profile.id, 'auth.provider': 'google' }, function (err, user) {
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