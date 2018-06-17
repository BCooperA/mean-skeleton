var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('User');
var auth = require('../../middleware/auth');
var nodemailer = require('nodemailer');
var randtoken       = require('rand-token');
var mail = require('../../middleware/mail');

router.get('/user', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user){
        if(!user){ return res.sendStatus(401); }

        return res.json({user: user.toAuthJSON()});
    }).catch(next);
});

router.get('/user/:id', auth.required, function(req, res, next) {
    User.findById(req.params.id).then(function(user) {
        if (!user) {
            return res.sendStatus(401);
        }
        return res.json(user.toProfileJSONFor());
    }).catch(next);
});

router.put('/user', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user){
        if(!user){ return res.sendStatus(401); }

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
    user.activation_token = (process.env.DEVELOPMENT_MODE == 'development') ? '' : randtoken.generate(32);
    user.active = (process.env.DEVELOPMENT_MODE == 'development') ? 1 : 0;

    user.save();

    if(process.env.DEVELOPMENT_MODE != "development") {
        // send the e-mail for newly registered account
        var transporter = nodemailer.createTransport(mail.nodemailer.mailgun.options);
        var mailOptions = {
            from: process.env.SMTP_USERNAME,
            to: user.email,
            subject: 'Vahvista reksiteröintisi sivustolle ' + process.env.APP_NAME,
            text: process.env.APP_DOMAIN + '/account/activate/' + user.activation_token
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log(info);
                return res.status(200).json( { status: "OK" } )
            }
        });
    } else {
        return res.status(200).json( { status: "OK" });
    }
});

module.exports = router;

