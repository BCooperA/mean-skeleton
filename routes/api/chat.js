var router = require('express').Router();
var mongoose = require('mongoose');
var Chat = mongoose.model('Chat');
var auth = require('../../middleware/auth');