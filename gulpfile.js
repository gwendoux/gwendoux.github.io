var gulp = require('gulp');
var less = require('gulp-less');
var cssmin = require('gulp-cssmin');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var connect = require('gulp-connect');
var uncss = require('gulp-uncss');


gulp.task('connect', function() {
  connect.server({
    root: 'src',
    port: 8014,
    livereload: true
  });
});

gulp.task('less', function () {
  gulp.src('./less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('css', function () {
    gulp.src('src/less/main.less')
        .pipe(less())
        .pipe(cssmin())
        //.pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('src/css/'));
});


gulp.task('html', function () {
  gulp.src('./src/*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./src/less/**/*.less'], ['css']);
});

gulp.task('default', ['css', 'connect', 'watch']);
