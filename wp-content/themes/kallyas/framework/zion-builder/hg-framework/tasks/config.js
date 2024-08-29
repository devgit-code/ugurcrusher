module.exports = {
    build_path_theme: './buildplugin/hg-framework',
    project: 'hg-framework',
    styleSRC: './assets/src/scss/*.scss',
    styleDestination: './assets/dist/css/',
    buildPath: './buildplugin/',
    AUTOPREFIXER_BROWSERS: [
        'last 2 version',
        '> 2%',
        'ie >= 11',
    ],
    buildInclude: [
		'**/*.*',

		// exclude files and folders
		'!assets/src/js/frontend/**/*',
		'!assets/src/scss/**/*',
		'!assets/dist/css/css-source-maps/**/*',
		'!node_modules/**/*',
		'!.git/**/*',
		'!package.json',
		'!package.json',
		'!yarn.lock',
		'!code-guidelines.md',
		'!.gitignore',
		'!.babelrc',
		'!buildplugin/**/*',
		'!**/*.map',
		'!hg-framework.zip'
	]
}