const router                        = require('express').Router()
    , mongoose                      = require('mongoose')
    , User                          = mongoose.model('User')
    , randtoken                     = require('rand-token')
    , mail                          = require('../config/mail')
    , nodemailer                    = require('nodemailer')
    , emailTemplates                = require('email-templates')
    , { check, validationResult }   = require('express-validator/check');

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
 | Route to check if e-mail address is already found in the database
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
 | Receives activation token from URI parameters,
 | validates it (runs a query to check that token belongs to someone) and eventually
 | removes activation token from the database and activates user byt setting the active property to 1
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
 | Receives email address from request body
 | validates it (runs a query to check that email belongs to someone) and eventually
 | sends an link to reset password via e-mail
 */
router.put('/password/recover', function(req, res, next) {
    User.findOne( { email: new RegExp('^'+ req.body.user.email +'$', "i") }, function(err, user) {
        if(err)
            return next(err);

        if(!req.body.user.email) {
            return res.status(422).json({ error: "E-mail can't be blank" });
        }

        if(!user) {
            // e-mail address was not found in the database
            return res.status(422).json({ error: "E-mail not found"});
        } else {
            // generate a request token for password reset
            user.request_password_token = randtoken.generate(32);

            // if user is saved, send email
            user.save().then(function() {
                const email = new emailTemplates ({
                    transport: nodemailer.createTransport(mail.nodemailer.gmail.options),
                    send: true, // uncomment below to send emails in development/test env
                    message: {
                        from: 'tatu.kulm@gmail.com'
                    }
                });

                email.send({
                    template: 'recover',
                    message: {
                        to: user.email,
                        subject: process.env.APP_NAME + ' - Salasanan palautus'
                    },
                    locals: {
                        name: user.name,
                        siteName: process.env.APP_NAME,
                        recover_url: process.env.APP_DOMAIN + '/account/reset/' + user.request_password_token
                    }
                }).then(function() {
                    return res.status(200).json( { status: "OK" });
                }).catch(console.error);
            });
        }
    }).catch(next);
});

/**
 |--------------------------------------------------------------------------
 | Password reset request
 |--------------------------------------------------------------------------
 | Receives token for resetting password from URI parameters,
 | validates it (runs a query to check that token belongs to someone) and eventually
 | replaces old password with new password
 */
router.put('/password/reset/:password_request_token', [
    // validation
    check('user.password')
        .isLength({ min: 5 }).withMessage('Password must be at least 5 chars long')
        .matches(/\d/).withMessage('Password must contain at least one number'),
],function(req, res, next) {

    try {
        validationResult(req).throw();

        /**
         * Check whether or not the two passwords match
         * NOTE! we cannot use custom validator function for this because it returns an
         * "TypeError: Cannot read property 'then' of undefined".
         * Must be some kind of a bug
         */
        if(req.body.user.password !== req.body.user.passwordVrf) {
            return res.status(422).json({error: "Passwords don't match"});
        }
        // if input validation passes, next validate the token from query params
        User.findOne( { request_password_token: new RegExp('^'+ req.params.password_request_token +'$', "i") }, function(err, user) {
            if (err) return next(err);

            if (!user) {
                return res.status(422).json({error: "Reset token is invalid"});
            } else {
                user.request_password_token = ''; // reset request password token
                user.password = req.body.user.password; // store hash and salt in the database

                return user.save().then(function () {
                    return res.status(200).json({status: "OK"});
                });
            }
        });
    } catch (err) {
        // print any validation errors
        return res.status(422).json({ error: err.array()[0].msg });
    }
});

module.exports = router;
