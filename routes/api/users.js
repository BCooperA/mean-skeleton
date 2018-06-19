const router            = require('express').Router()
    , mongoose          = require('mongoose')
    , User              = mongoose.model('User')
    , auth              = require('../../middleware/auth')
    , randtoken         = require('rand-token')
    , mail              = require('../../config/mail')
    , nodemailer        = require('nodemailer')
    , sgTransport       = require('nodemailer-sendgrid-transport')
    , emailTemplates    = require('email-templates');

/**
 |--------------------------------------------------------------------------
 | API Routes - Users
 |--------------------------------------------------------------------------
 |
 | This file is where you may define all of your user based routes
 | for retrieving, updating, inserting and deleting users
 |
 */

/**
 |--------------------------------------------------------------------------
 | HTTP GET user "/api/users/user"
 |--------------------------------------------------------------------------
 |
 | Retrieves user data based on JSON Web Token saved in payload
 |
 */
router.get('/user', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user){
        if(!user){ return res.sendStatus(401); }

        return res.json({user: user.toAuthJSON()});
    }).catch(next);
});

/**
 |--------------------------------------------------------------------------
 | HTTP GET user "/api/users/user/1"
 |--------------------------------------------------------------------------
 |
 | Retrieves user data based on user id in route parameter
 |
 */
router.get('/user/:id', auth.required, function(req, res, next) {
    User.findById(req.params.id).then(function(user) {
        if (!user) {
            return res.sendStatus(401);
        }
        return res.json(user.toProfileJSONFor());
    }).catch(next);
});

/**
 |--------------------------------------------------------------------------
 | HTTP PUT user "/api/users/user"
 |--------------------------------------------------------------------------
 |
 | Updates user data based on JSON Web Token saved in payload
 |
 */
router.put('/user', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user){

        if(!user) {
            return res.sendStatus(401);
        }

        // only update fields that were actually passed...
        if(typeof req.body.user.username !== 'undefined'){
            user.username = req.body.user.username;
        }
        if(typeof req.body.user.email !== 'undefined'){
            user.email = req.body.user.email;
        }
        if(typeof req.body.user.image !== 'undefined'){
            user.image = req.body.user.image;
        }
        if(typeof req.body.user.password !== 'undefined'){
            user.setPassword(req.body.user.password);
        }

        return user.save().then(function(){
            return res.json({user: user.toAuthJSON()});
        });
    }).catch(next);
});

/**
 |--------------------------------------------------------------------------
 | HTTP POST user "/api/users"
 |--------------------------------------------------------------------------
 |
 | Add's new user to the database
 | TODO: Handle validation better
 | TODO: Create a helper function for sending mails instead of hard coding it here
 */
router.post('/users', function(req, res, next) {

    // validation
    if(!req.body.user.email) {
        return res.status(422).json({ errors: { email: "can't be blank" } });
    }

    if(!req.body.user.name) {
        return res.status(422).json({ errors: { name: "can't be blank" } });
    }

    if(!req.body.user.password) {
        return res.status(422).json({ errors: { password: "can't be blank" } });
    }

    if(req.body.user.password.length <= 6) {
        return res.status(422).json({ errors: { password: "is too short" } });
    }


    var user = new User();
    user.email = req.body.user.email;
    user.name = req.body.user.name;
    user.setPassword(req.body.user.password);
    user.activation_token = randtoken.generate(32);
    user.active = 0;

    user.save();

    const email = new emailTemplates ({
        transport: nodemailer.createTransport(sgTransport(mail.nodemailer.sendgrid.options)),
        message: {
            from: 'tatu.kulm@gmail.com'
        },
        send: true // uncomment below to send emails in development/test env:
    });

    email.send({
        template: 'signup',
        message: {
            to: user.email,
            subject: process.env.APP_NAME + ' - Rekisteröinti'
        },
        locals: {
            name: user.name,
            siteName: process.env.APP_NAME,
            activation_url: process.env.APP_DOMAIN + '/account/activate/' + user.activation_token
        }
    }).then(function() {
        return res.status(200).json( { status: "OK" });
    }).catch(console.error);
});

module.exports = router;

