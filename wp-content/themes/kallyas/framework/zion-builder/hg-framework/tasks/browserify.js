const { src, dest } = require('gulp')
const gutil         = require('gulp-util')
const path         = require('path')
const browserify  = require('browserify')
const underscorify = require('node-underscorify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const uglify       = require('gulp-uglify')
const rename      = require('gulp-rename')

module.exports = function (cb) {
	var appPaths = [
		// Admin shortcodes app
		'./assets/src/js/admin/shortcodes/',
		'./assets/src/js/admin/options/'
	];

	appPaths.map(function(folder) {

		// Replace src with dist
		var distPath = folder.replace('src','dist'),
		// Get the final filename name
		dirname = path.basename(distPath);

		return browserify(folder + dirname +'.js',{debug:true})
			.on('error', gutil.log)
			.transform(underscorify)
			.bundle()
			// Pass desired output filename to vinyl-source-stream
			.pipe(source(dirname+'.js'))
			// Start piping stream to tasks!
			.pipe(dest(distPath))
			.pipe(buffer())
			// Minimify the code
			.pipe(uglify())
			// rename to folder.min.js
			.pipe(rename(dirname+'.min.js'))
			// write to output again
			.pipe(dest(distPath));
	});

	cb();
};
