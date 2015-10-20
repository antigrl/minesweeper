'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var lodashBuilder = require('gulp-lodash-builder');
var coffee = require('gulp-coffee');
var gutil = require('gulp-util');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function () {
  gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('coffee', function() {
  gulp.src('./js/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./js/'))
});


gulp.task('watch', function () {
  gulp.watch('./sass/*.scss', ['sass'])
  gulp.watch('./js/*.coffee', ['coffee'])
});

gulp.task('default', ['watch', 'sass', 'coffee'], function() {
  return gulp.src('css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('css'));
});