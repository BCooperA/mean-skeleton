require('dotenv').config(); // load environment variables before launching the application

const express             = require('express')
    , bodyParser          = require('body-parser')
    , session             = require('express-session')
    , cors                = require('cors')
    , passport            = require('passport')
    , errorhandler        = require('errorhandler')
    , mongoose            = require('mongoose')
    , helmet              = require('helmet')
    , cookieParser        = require('cookie-parser')
    , config              = require('./config/index');

/**
 |--------------------------------------------------------------------------
 | Main server file
 |--------------------------------------------------------------------------
 |
 | This file is where you may define all the application middlewares, database connection and finally
 | start the server
 |
 */
const app = express();
var isProduction = process.env.NODE_ENV === 'production';

/**
 |--------------------------------------------------------------------------
 | Configuration
 |--------------------------------------------------------------------------
 */
app.use(helmet());                  // secure your Express apps by setting various HTTP headers with helmet
app.use(cors());                    // enable CORS (See: https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
app.use(cookieParser());            // Parse HTTP request cookies
app.use(require('morgan')('dev'));  // HTTP request logger middleware for node.js
app.use(bodyParser.urlencoded({ extended: false })); // returns middleware that only parses urlencoded bodies.
app.use(bodyParser.json()); // returns middleware that only parses json

app.use(require('method-override')()); // Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));
app.use(passport.initialize()); // initialize passport strategies
app.use(passport.session()); // initialize sessions for passport


/**
 * This middleware is only intended to be used in a development environment,
 * as the full error stack traces and internal details of any object passed to this module
 * will be sent back to the client when an error occurs.
 * See: https://github.com/expressjs/errorhandler
 */
if (!isProduction) {
    app.use(errorhandler());
}

app.set('view engine','pug'); // set view engine to pug for our email templates


/**
 |--------------------------------------------------------------------------
 | Database Connection
 |--------------------------------------------------------------------------
 */
mongoose.connect(config.mongodb.url, {
    useMongoClient: true,
    promiseLibrary: require('bluebird')
});

/**
 |--------------------------------------------------------------------------
 | Database Models
 |--------------------------------------------------------------------------
 */
require('./models/User');
require('./models/Article');
require('./models/Comment');
require('./config/passport');

/**
 |--------------------------------------------------------------------------
 | Static files for front end
 |--------------------------------------------------------------------------
 */
app.use("/js", express.static(__dirname + "/public/js")); // javascript files
app.use("/fonts", express.static(__dirname + "/public/fonts")); // fonts
app.use("/css", express.static(__dirname + "/public/styles")); // stylesheets
app.use("/img", express.static(__dirname + "/public/img")); // images
app.use("/angular", express.static(__dirname + "/app")); // angular files

/**
 |--------------------------------------------------------------------------
 | Routes
 |--------------------------------------------------------------------------
 */
app.use(require('./routes'));

/**
 |--------------------------------------------------------------------------
 | Front end routes
 |--------------------------------------------------------------------------
 | NOTE! use this only if you are developing an SPA (single page application)
 |--------------------------------------------------------------------------
 */
app.get('*', function(req, res) {
    res.sendFile("./app/index.html", { root: __dirname });
});

/**
 |--------------------------------------------------------------------------
 | Response headers
 |--------------------------------------------------------------------------
 | See: https://stackoverflow.com/questions/32500073/request-header-field-access-control-allow-headers-is-not-allowed-by-itself-in-pr
 |--------------------------------------------------------------------------
 */
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

/**
 |--------------------------------------------------------------------------
 | Error Handlers
 |--------------------------------------------------------------------------
 */

/**
 |--------------------------------------------------------------------------
 | 404
 |--------------------------------------------------------------------------
 */
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/**
 |--------------------------------------------------------------------------
 | Development Error Handler
 | Prints stacktrace
 |--------------------------------------------------------------------------
 */
if (!isProduction) {
    app.use(function(err, req, res, next) {
        console.log(err.stack);

        res.status(err.status || 500);
        res.json({'errors': { message: err.message, error: err } });
    });
}

/**
 |--------------------------------------------------------------------------
 | Production Error Handler
 | No stacktraces leaked to user
 |--------------------------------------------------------------------------
 */
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({'errors': { message: err.message, error: {} } });
});

/**
 |--------------------------------------------------------------------------
 | Start server / application
 |--------------------------------------------------------------------------
 */
var server = app.listen( process.env.PORT || 3000, function(){
    console.log('Listening on port ' + server.address().port);
});