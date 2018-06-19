const   router          = require('express').Router(),
        mongoose        = require('mongoose'),
        User            = mongoose.model('User'),
        randtoken       = require('rand-token'),
        mail            = require('../config/mail'),
        nodemailer      = require('nodemailer'),
        sgTransport     = require('nodemailer-sendgrid-transport'),
        emailTemplates  = require('email-templates');

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
            return res.status(422).json({ errors: { email: "can't be blank" } });
        }

        if(!user) {
            // e-mail address was not found in the database
            return res.status(422).json({ errors: { email: "not found"} });
        } else {
            // generate a request token for password reset
            user.request_password_token = randtoken.generate(32);

            // save and send email
            user.save();

            const email = new emailTemplates ({
                transport: nodemailer.createTransport(sgTransport(mail.nodemailer.sendgrid.options)),
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
router.put('/password/reset/:password_request_token', function(req, res, next) {
    User.findOne( { request_password_token: new RegExp('^'+ req.params.password_request_token +'$', "i") },
        function(err, user) {
            if(err)
                return next(err);
            if(!user) {
                // invalid token or it does not belong to user
                return res.status(422).json({"error": true, "message": "Invalid token"});
            } else {
                if(typeof req.body.user.password !== 'undefined') {
                    user.request_password_token = ''; // reset request password token
                    user.setPassword(req.body.user.password); // store hash and salt in the database
                }

                return user.save().then(function() {
                    return res.status(200).json({status: "OK"});
                });
            }
        }).catch(next);
});

module.exports = router;
