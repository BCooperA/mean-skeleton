const mongoose            = require('mongoose')
    , crypto              = require('crypto')
    , bcrypt              = require('bcrypt-nodejs')
    , SALT_WORK_FACTOR    = 10
    , jwt                 = require('jsonwebtoken')
    , secret              = require('../config/index').jwt_secret;

const UserSchema = new mongoose.Schema({
    auth: {
        provider: String,
        oauthID: Number,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true,
    },
    name: {
        type: String,
        required: true
    },
    image: String,
    location: String,
    password: {
        type: String,
        required: true
    },
    request_password_token: {
        type: String,
        default: ''
    },
    activation_token: {
        type: String,
        default: ''
    },
    active: {
        type: Number,
        default: 0,
    }
    //favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
    //following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

/**
 * Check whether the entered password matches with the salt and hash saved in the database
 * @param password
 * @returns {boolean}
 */
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

/**
 * Hash password with blowfish algorithm (bcrypt) before saving it in to the database
 */
UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password'))
        return next();

    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);
    next();
});

/**
 * Generates JSON Web Token (JWT) for authenticated user
 * @returns {*}
 */
UserSchema.methods.generateJWT = function() {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        id: this._id,
        email: this.email,
        exp: Math.floor(Date.now() / 1000) + (60 * 1) // Set the token expire time to 60 min
    }, secret);
};

/**
 * Returns users id, email and the JWT
 * @returns {*}
 */
UserSchema.methods.toAuthJSON = function(){
    return {
        _id: this._id,
        email: this.email,
        token: this.generateJWT()
    };
};

/**
 * Returns users public information
 * @returns {*}
 */
UserSchema.methods.toProfileJSONFor = function(user){
    return {
        _id: this._id,
        username: this.username,
        name: this.name,
        location: this.location,
        // bio: this.bio,
        image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
        // following: user ? user.isFollowing(this._id) : false
    };
};

UserSchema.methods.favorite = function(id){
    if(this.favorites.indexOf(id) === -1){
        this.favorites.push(id);
    }

    return this.save();
};

UserSchema.methods.unfavorite = function(id){
    this.favorites.remove(id);
    return this.save();
};

UserSchema.methods.isFavorite = function(id){
    return this.favorites.some(function(favoriteId){
        return favoriteId.toString() === id.toString();
    });
};

UserSchema.methods.follow = function(id){
    if(this.following.indexOf(id) === -1){
        this.following.push(id);
    }

    return this.save();
};

UserSchema.methods.unfollow = function(id){
    this.following.remove(id);
    return this.save();
};

UserSchema.methods.isFollowing = function(id){
    return this.following.some(function(followId){
        return followId.toString() === id.toString();
    });
};

mongoose.model('User', UserSchema);
