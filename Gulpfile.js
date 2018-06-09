var     gulp            = require('gulp'),
        less            = require('gulp-less'),
        cssmin          = require('gulp-cssmin'),
        plumber         = require('gulp-plumber'),
        rename          = require('gulp-rename'),
        uglify          = require('gulp-uglify'),
        concat          = require('gulp-concat'),
        ngAnnotate      = require('gulp-ng-annotate'),
        htmlmin         = require('gulp-htmlmin');

/* watch for files */
gulp.task('watch', function () {
    gulp.watch('./public/styles/**/*.less', ['less']);
    gulp.watch('./app/**/*.js', ['js']);
    //gulp.watch('./app/**/*.html', ['html']);
});

/* compress & compile LESS files into CSS files */
gulp.task('less', function () {
    gulp.src('./public/styles/app.less')
        .pipe(plumber())
        .pipe(less({
            paths: [
                '.',
                './node_modules/bootstrap-less'
            ]
        }))
        .pipe(gulp.dest('./public/styles/'))
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./public/styles'))

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

gulp.task('default', ['less', 'js', 'watch']);