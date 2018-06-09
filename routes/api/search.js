var router = require('express').Router();
var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var User = mongoose.model('User');
var auth = require('../../middleware/auth');
var async = require('async');

/**
 * Search based on a key term
 * Note: route parameter is optional, the search key can also be in request body
 */
router.post('/:term?', auth.required, function(req, res, next) {

    var searchResults = {};

    async.parallel([
        // search for users
        function(callback) {
            User.find({'name': new RegExp(req.params.term ? req.params.term : req.body.query, 'i')},function(err, user){
                if (err) return callback(err);
                searchResults.user = user;
                callback();
            });
        },
        // seach for articles
        function(callback) {
            Article.find({'title' : new RegExp(req.params.term ? req.params.term : req.body.query, 'i')},function(err, article){
                if (err) return callback(err);
                searchResults.article = article;
                callback();
            });
        }
    ], function(err) {
        //This function gets called after the two tasks have called their "task callbacks"
        if (err)
        //If an error occurred, we let express handle it by calling the `next` function
            return next(err);

        // print search results
        res.json({ "users": searchResults.user, "articles": searchResults.article });
    });
});
module.exports = router;
