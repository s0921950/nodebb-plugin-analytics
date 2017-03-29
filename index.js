var	fs = require('fs'),
	path = require('path'),

	nconf = require('nconf'),

	winston = module.parent.require('winston'),
	Meta = module.parent.require('./meta'),

	db = module.parent.require('./database'),
	user = module.parent.require('./user'),
	categories = module.parent.require('./categories'),
	topics = module.parent.require('./topics'),

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
		done: GA.settings.activate_analytic && GA.settings.api_url,
		doneText: 'Forum Analytics OK',
		notDoneText: 'Forum Analytics needs setup'
	});

	callback(null, notices);
}

GA.writeData = function(req) {
	var viewPage, category, categoryName, topicName;
	var referer = req.req.headers.referer;
	var url = referer.substr(0, referer.indexOf(nconf.get('relative_path')));
	var location = url + nconf.get('relative_path') + '/';
	if (referer.indexOf(location) !== -1 && referer.length == location.length){
		viewPage = 'mainPage';
	} else {
		viewPage = referer.replace(location, '');
	}
	category = viewPage.split('/')[0];
	if (category == 'category'){
		var cid = viewPage.split('/')[1];
		categories.getCategoryData(cid, function (err, category) {
			categoryName = category.name;
			var topicName;
			GA.saveDB(req, viewPage, categoryName, topicName);
		});
	} else if (category == 'topic'){
		var tid = viewPage.split('/')[1];
		topics.getTopicData(tid, function (err, topic) {
			categories.getCategoryData(topic.cid, function (err, category) {
				categoryName = category.name;
				var topicName;
				GA.saveDB(req, viewPage, categoryName, topic.title);
			});
		});
	} else {
		var categoryName, topicName;
		GA.saveDB(req, viewPage, categoryName, topicName);
	}
};

GA.saveDB = function(req, viewPage, categoryName, topicName) {
	if (req.req.user) {
		var uid = req.req.user.uid;

		user.getUserData(uid, function (err, users) {
			var userData = {
				'username': users.username,
				'userAgent': req.req.headers['user-agent'],
				'time': Date.now(),
				'viewPage': viewPage,
				'categoryName': categoryName,
				'topicName': topicName,
				'os': req.req.useragent.os,
				'browser': req.req.useragent.browser,
				'platform': req.req.useragent.platform
			};
			db.addCountLogin('user:pageview',  Date.now(), userData);
		});
	} else {
		var userData = {
				'username': 'guest',
				'userAgent': req.req.headers['user-agent'],
				'time': Date.now(),
				'viewPage': viewPage,
				'categoryName': categoryName,
				'topicName': topicName,
				'os': req.req.useragent.os,
				'browser': req.req.useragent.browser,
				'platform': req.req.useragent.platform
			};
		db.addCountLogin('user:pageview',  Date.now(), userData);
	}
}

module.exports = GA;
