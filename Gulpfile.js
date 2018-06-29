// =========================================================
// Gulpfile
// =========================================================
const   gulp            = require('gulp'),
        less            = require('gulp-less'),
        cssmin          = require('gulp-cssmin'),
        plumber         = require('gulp-plumber'),
        rename          = require('gulp-rename'),
        uglify          = require('gulp-uglify'),
        concat          = require('gulp-concat'),
        ngAnnotate      = require('gulp-ng-annotate'),
        htmlmin         = require('gulp-htmlmin');

// ------------------------------------------------- configs
var config = {
    less: {
        src: './public/styles/app.less',
        dest: './public/styles',
        opts: {

        }
    },

    js: {
        src: [
            './app/app.js',
            './app/app-constants/states.js',
            './app/utils.js',
            './app/MainCtrl.js',
            './app/app-components/**/**/*.js',
            './app/app-directives/*.directive.js',
            './app/app-services/*.service.js'
        ],
        dest: './public/js/src'
    }
};

// ---------------------------------------------- Gulp Tasks
// =========================================================
// WATCH - watches for file changes and executes related tasks
// =========================================================
gulp.task('watch', function () {
    gulp.watch('./public/styles/**/*.less',  ['less']);
    gulp.watch('./app/**/*.js', ['js']);
    //gulp.watch('./app/**/*.html', ['html']);
});

// ===========================================================================
// LESS - compress & compiles LESS files into a single CSS file (app.min.css)
// ===========================================================================
gulp.task('less', function () {
    return gulp.src(config.less.src)
        .pipe(plumber())
        .pipe(less({
            paths: [
                config.less.src,
                './node_modules/bootstrap-less'
            ]
        }))
        .pipe(gulp.dest(config.less.dest))
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(config.less.dest))

});

// ===========================================================================
// JS - compress & compiles AngularJS files into a one single JS file (app.js)
// ===========================================================================
gulp.task('js', function() {
    return gulp.src(config.js.src)
        .pipe(plumber())
        .pipe(concat('app.js', { newLine: ';' }))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest(config.js.dest));
});

// ===========================================================================
// HTML - compress & removes comments from HTML files (use in production)
// ===========================================================================
gulp.task('html', function() {
    return gulp.src('./public/app/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(gulp.dest('./public/dist'));
});

// ===========================================================================
// FONTS - copy fonts from node_modules folder to application's `fonts` folder
// ===========================================================================
gulp.task('fonts', function() {
    return gulp.src([
        'node_modules/@fortawesome/fontawesome-free/webfonts/*',
        'node_modules/bootstrap-less/fonts/*'
    ])
        .pipe(gulp.dest('public/fonts'))
});

// --------------------------------------- Default Gulp Task
gulp.task('default', ['watch']);