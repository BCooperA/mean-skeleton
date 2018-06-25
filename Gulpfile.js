// =========================================================
// gulpfile.js
// =========================================================
var     gulp            = require('gulp'),
        less            = require('gulp-less'),
        cssmin          = require('gulp-cssmin'),
        plumber         = require('gulp-plumber'),
        rename          = require('gulp-rename'),
        uglify          = require('gulp-uglify'),
        concat          = require('gulp-concat'),
        ngAnnotate      = require('gulp-ng-annotate'),
        htmlmin         = require('gulp-htmlmin');

// ------------------------------------------------- configs
var paths = {
    less: {
        src: './public/styles/app.less',
        dest: './public/styles',
        opts: {

        }
    }
};

// ---------------------------------------------- Gulp Tasks
/* watch for files */
gulp.task('watch', function () {
    gulp.watch('./public/styles/**/*.less', gulp.series('less'));
    //gulp.watch('./app/**/*.js', 'js', gulp.series('js'));
    //gulp.watch('./app/**/*.html', ['html']);
});

/* compress & compile LESS files into CSS files */
gulp.task('less', function () {
    return gulp.src(paths.less.src)
        .pipe(plumber())
        .pipe(less({
            paths: [
                '.',
                './node_modules/bootstrap-less'
            ]
        }))
        .pipe(gulp.dest(paths.less.dest))
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.less.dest))

});

/* compile and compress javascript files into one single app.js file */
gulp.task('js', function() {
    return gulp.src([
        './app/app.js',
        './app/utils.js',
        './app/app-components/**/**/*.js',
        './app/app-services/*.service.js',
        './app/app-directives/*.directive.js'
    ])
        .pipe(plumber())
        .pipe(concat('app.js', { newLine: ';' }))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest('./public/js/src'));
});

// gulp.task('html', function() {
//     return gulp.src('./public/app/**/*.html')
//         .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
//         .pipe(gulp.dest('./public/dist'));
// });

/* load fonts from node_modules folder to application's `fonts` foler */
gulp.task('fonts', function() {
    return gulp.src([
        'node_modules/font-awesome/fonts/*',
        'node_modules/bootstrap-less/fonts/*'
    ])
        .pipe(gulp.dest('public/fonts'))
});

// --------------------------------------- Default Gulp Task
gulp.task('default', gulp.series('watch'));