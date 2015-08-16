var gulp       = require("gulp");
var uglify     = require("gulp-uglify");
var rename     = require("gulp-rename");
var less       = require("gulp-less");
var minifyCss  = require("gulp-minify-css");



gulp.task("scripts", function() {
	gulp.src("js/*.js")
		.pipe(uglify())
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(gulp.dest("dist/"));		
});

gulp.task("styles", function() {
	gulp.src("less/*.less")
		.pipe(less())
		.pipe(minifyCss())
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(gulp.dest("dist/"));	
});

gulp.task("default", ["scripts", "styles"], function() {
});

gulp.task('watch', function() {
	gulp.watch("js/*.js", ["scripts"]);
	gulp.watch("less/*.less", ["styles"]);	
});