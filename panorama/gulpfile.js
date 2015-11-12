var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('default', function() {

	gulp.src('./css/source/app.scss')
		.pipe(sass({errLogToConsole: true}))
		.pipe(gulp.dest('./css/'));

	gulp.src('./js/app/*.js')
		.pipe(concat('app.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./js/'));

});

