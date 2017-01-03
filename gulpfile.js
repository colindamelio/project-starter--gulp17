// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');

// Lint Task
gulp.task('lint', function() {
  return gulp.src('js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

// Compile Our Sass
gulp.task('sass', function() {
  return gulp.src('dev/styles/main.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('public'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
  return gulp.src('dev/js/*.js')
    .pipe(concat('all.js'))
    .pipe(rename('all.min.js'))
    .pipe(uglify().on('error', function(e){
      console.log(e);
    }))
    .pipe(gulp.dest('public'));
});

// Image optimization
gulp.task('images', function(){
  return gulp.src('dev/images/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(imagemin({ progressive: true }))
    .pipe(gulp.dest('public/images'));
});

// Watch Files For Changes
gulp.task('watch', ['browserSync', 'sass', 'lint'], function() {
  gulp.watch('dev/js/*.js', ['lint', 'scripts', browserSync.reload]);
  gulp.watch('dev/styles/*.scss', ['sass', browserSync.reload]);
  gulp.watch('*.html', browserSync.reload);
});

// Browser Sync
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: './'
    },
  });
});

// Default Task
gulp.task('default', ['lint', 'sass', 'scripts', 'watch', 'browserSync', 'images']);
