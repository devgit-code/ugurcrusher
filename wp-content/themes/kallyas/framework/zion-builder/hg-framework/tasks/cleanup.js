const del    = require('del')
const config = require( './config' )

module.exports = function (cb) {
	del(config.buildPath)
	cb();
};
