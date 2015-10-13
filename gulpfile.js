var gulp    = require('gulp'),
    util    = require('gulp-util'),
    wiredep = require('wiredep').stream,
    inject  = require('gulp-inject'),
    sass    = require('gulp-sass'),
    coffee  = require('gulp-coffee'),
    smaps   = require('gulp-sourcemaps');



gulp.task('sass', function () {
  return gulp.src('sass/main.scss')
    .pipe(smaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(smaps.write())
    .pipe(gulp.dest('dest/styles'));
});

gulp.task('coffee', function() {
  gulp.src('scripts/*.coffee')
    .pipe(smaps.init())
    .pipe(coffee({bare: true}).on('error', util.log))
    .pipe(smaps.write())
    .pipe(gulp.dest('dest/scripts'))
});

gulp.task('inject', function () {
    var target = gulp.src('index.html');
    var sources = gulp.src(['./dest/scripts/*.js', './dest/styles/*.css'], {read: false});

    return target
        .pipe(wiredep())
        .pipe(inject(sources))
        .pipe(gulp.dest('dest'));
});

gulp.task('default', ['sass', 'coffee', 'inject'], function () {
  gulp.watch('sass/*.scss');
  gulp.watch('scripts/*.coffee');
});