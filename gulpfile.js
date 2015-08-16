var gulp       = require("gulp");
var uglify     = require("gulp-uglify");
var rename     = require("gulp-rename");
var less       = require("gulp-less");
var minifyCss  = require("gulp-minify-css");
var karma      = require('gulp-karma');


gulp.task("scripts", function() {
	return gulp.src("js/*.js")
		.pipe(uglify())
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(gulp.dest("dist/"));		
});

gulp.task("styles", function() {
	return gulp.src("less/*.less")
		.pipe(less())
		.pipe(minifyCss())
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(gulp.dest("dist/"));	
});

gulp.task('test', function (done) {
	 return gulp.src('test/index.js')
		.pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }));
});

gulp.task("default", ["test", "scripts", "styles"]);

gulp.task('watch', function() {
	gulp.watch("js/*.js", ["scripts"]);
	gulp.watch("less/*.less", ["styles"]);	
});