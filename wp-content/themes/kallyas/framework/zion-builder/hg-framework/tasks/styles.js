const { src, dest } = require('gulp')
const sass          = require('gulp-sass')
const autoprefixer  = require('gulp-autoprefixer')
const lineec        = require('gulp-line-ending-corrector')
const sourcemaps    = require('gulp-sourcemaps')
const config        = require( './config' )
const plumber       = require('gulp-plumber')
const gutil         = require('gulp-util')

// Frontend Styles
module.exports = function (cb) {
	return src( config.styleSRC )
		.pipe(plumber())
		.pipe( sourcemaps.init() )
		.pipe( sass( {
			errLogToConsole: true,
			outputStyle: 'compressed',
			precision: 10
		}))
		.pipe( autoprefixer( config.AUTOPREFIXER_BROWSERS ) )
		.on('error', gutil.log)
		.pipe( sourcemaps.write ( '/css-source-maps/' ) ) // Create non-minified sourcemap
		.pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
		.pipe( dest( config.styleDestination ) );
};