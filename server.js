require('dotenv').config(); // load environment variables before launching the application

const   express             = require('express'),
        bodyParser          = require('body-parser'),
        session             = require('express-session'),
        cors                = require('cors'),
        passport            = require('passport'),
        errorhandler        = require('errorhandler'),
        mongoose            = require('mongoose'),
        helmet              = require('helmet'),
        cookieParser        = require('cookie-parser'),
        config              = require('./config/index');

/**
 |--------------------------------------------------------------------------
 | Main server file
 |--------------------------------------------------------------------------
 |
 | This file is where you may define all the application middlewares, database connection and finally
 | start the server
 |
 */

/**
 * Create global app object
 * @type {*|Function}
 */
const app = express();
var isProduction = process.env.NODE_ENV === 'production';

/**
 |--------------------------------------------------------------------------
 | Configuration
 |--------------------------------------------------------------------------
 */
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(require('morgan')('dev'));

// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.urlencoded({ extended: false })); // returns middleware that only parses urlencoded bodies.
app.use(bodyParser.json()); // returns middleware that only parses json.

app.use(require('method-override')());
app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

if (!isProduction) {
    app.use(errorhandler());
}
app.use(passport.initialize());
app.use(passport.session());

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
 | Static files for frontend
 |--------------------------------------------------------------------------
 */
app.use("/js", express.static(__dirname + "/public/js"));
app.use("/fonts", express.static(__dirname + "/public/fonts"));
app.use("/css", express.static(__dirname + "/public/styles"));
app.use("/img", express.static(__dirname + "/public/img"));
app.use("/angular", express.static(__dirname + "/app"));

// front end framework files (angularJS)
app.use("/app", express.static(__dirname + "/public/app"));

/**
 |--------------------------------------------------------------------------
 | Routes
 |--------------------------------------------------------------------------
 */
app.use(require('./routes'));

/**
 |--------------------------------------------------------------------------
 | Front-end routes
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