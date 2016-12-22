var	fs = require('fs'),
	path = require('path'),

	winston = module.parent.require('winston'),
	Meta = module.parent.require('./meta'),

	db = module.parent.require('./database'),

	GA = {
		settings: {}
	};

GA.init = function(data, callback) {
	function render(req, res, next) {
		res.render('admin/plugins/analytics', {});
	}

	data.router.get('/admin/plugins/analytics', data.middleware.admin.buildHeader, render);
	data.router.get('/api/admin/plugins/analytics', render);
	data.router.get('/api/plugins/analytics', function(req, res) {
		if (GA.settings) {
			res.status(200).json(GA.settings);
		} else {
			res.send(501);
		}
	});

	// Load asset ID from config
	GA.loadSettings();

	callback();
};

GA.loadSettings = function() {
	Meta.settings.get('analytics', function(err, settings) {
		if (!err && settings.activate_analytic && settings.api_url) {
			GA.settings = settings;
		} else if (settings.activate_analytic === 'on'){
			GA.settings = settings;
			winston.error('A Analytics API server was not specified. Please complete setup in the administration panel.');
		}
	});
};

GA.onConfigChange = function(hash) {
	if (hash === 'settings:analytics') {
		GA.loadSettings();
	}
};

GA.routeMenu = function(custom_header, callback) {
	custom_header.plugins.push({
		"route": '/plugins/analytics',
		"icon": 'fa-bar-chart-o',
		"name": 'Forum Analytics'
	});

	callback(null, custom_header);
};

GA.getNotices = function(notices, callback) {
	notices.push({
		done: GA.settings.activate_analytic && settings.api_url,
		doneText: 'Forum Analytics OK',
		notDoneText: 'Forum Analytics needs setup'
	});

	callback(null, notices);
}

module.exports = GA;
