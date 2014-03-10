var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    nodemon = require('gulp-nodemon'),
    cache = require('gulp-cache');

// Styles
gulp.task('styles', function(){
    return gulp.src('assets/sass/**/*.scss')
        .pipe(sass({ style: 'expanded' }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('public/styles'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('public/styles'))
        .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task('scripts', function() {
    return gulp.src('assets/scripts/**/*.js')
        .pipe(concat('*.js'))
        .pipe(gulp.dest('public/scripts'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('public/scripts'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

// Images
gulp.task('images', function() {
    return gulp.src('assets/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('public/images'))
        .pipe(notify({ message: 'Images task complete' }));
});

// Clean
gulp.task('clean', function() {
    return gulp.src(['public/styles/*', 'public/scripts/*', 'public/images/*'], {read: false})
        .pipe(clean());
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images');
});

// Watch
gulp.task('watch', function() {

    nodemon({ script: 'app.js', ext: 'html js scss', ignore: ['ignored.js'] })
        .on('restart', function () {
            gulp.start('default');
        });

    // Watch .scss files
    gulp.watch('assets/sass/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('assets/scripts/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('assets/images/**/*', ['images']);
});