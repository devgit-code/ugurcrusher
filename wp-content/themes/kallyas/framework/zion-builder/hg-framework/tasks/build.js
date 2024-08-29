const { src, dest, series, parallel } = require('gulp')
const readlineSync = require('readline-sync');
const fs          = require('fs')
const bump        = require('gulp-bump')
const styles      = require('./styles')
const browserify  = require('./browserify')
const translate   = require('./translate')
const cleanup     = require('./cleanup')
const config      = require( './config' )
const notify      = require('gulp-notify')
const zip         = require('gulp-zip')

function getPackageJsonVersion() {
	// Parse the JSON file instead of using require because require
	// caches multiple calls so the version number won't be updated
	return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
}

function changeVersion () {
	const oldVersion = getPackageJsonVersion();
	var newVersion = readlineSync.question(`What version number you are releasing? Current version is ${oldVersion}`);

	return src(
		[
			'./package.json',
			`./${config.project}.php`,
		], 
		{ 
			base: './' 
		}
	)
	.pipe(bump({ version: newVersion }))
	.pipe(dest('./'));	
};

function buildFiles() {
	return src(config.buildInclude)
		.pipe(dest( config.build_path_theme ))
		.pipe(notify({ message: 'Copy from Build Files complete', onLast: true }));
}


function buildZip() {
	return src( config.buildPath + '/**/*.*')
		.pipe(zip(config.project+'.zip'))
		.pipe(dest('./'))
		.pipe(notify({ message: 'Zip task complete', onLast: true }));
}

function finish(cb){
	notify({ message: 'All done' })

	cb();
}

// Frontend Styles
module.exports = series( parallel( styles, browserify, translate, changeVersion ), buildFiles, buildZip, cleanup, finish );