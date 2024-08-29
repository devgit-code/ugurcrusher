const { src, dest } = require('gulp')
const notify        = require('gulp-notify')
const sort          = require('gulp-sort')
const wpPot         = require('gulp-wp-pot')
const config        = require( './config' )

module.exports = function () {
	return src( './**/*.php' )
		.pipe(sort())
		.pipe(wpPot( {
			domain        : config.project,
			package       : config.project,
			bugReport     : 'https://my.hogash.com/support/',
			team          : 'Hogash'
		} ))
		.pipe(dest( './languages/'+ config.project +'.pot' ))
		.pipe( notify( { message: 'TASK: "translate" Completed! 💯', onLast: true } ) );
};
