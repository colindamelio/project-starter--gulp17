// include gulp & plugins
var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish'),
  sass = require('gulp-sass'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  browserSync = require('browser-sync').create(),
  autoprefixer = require('gulp-autoprefixer'),
  imagemin = require('gulp-imagemin'),
  babel = require('gulp-babel');

// Lint Task
gulp.task('lint', function() {
  return gulp.src('dev/js/*.js')
    .pipe(jshint({
      esnext: true
    }))
    .pipe(jshint.reporter(stylish, {beep: true}));
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
    .pipe(babel({
      presets: ['es2015']
    }))
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
