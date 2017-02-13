"use strict";
/* global socket */

$(document).ready(function() {
	
	var analyticActivate, apiUrl;

	socket.emit('admin.settings.get', {
		hash: 'analytics'
	}, function (err, values) {
		if (err) {
			return callback(err);
		} 
		analyticActivate = values.activate_analytic;
		apiUrl = values.api_url;
		
		if(analyticActivate === 'on'){
			console.log(window.location.href);
			console.log(navigator);
			var ip, endTime;
			var startTime = Date.now();
			var viewPage;
			$.get(RELATIVE_PATH + '/api/plugins/analytics').done(function(config) {
				console.log(config);

				$.ajax({
					type: "POST",
					url: apiUrl,
					data: { 
						platform: navigator.platform,
						appVersion: navigator.appVersion,
						language: navigator.language,
						time: new Date(),
						now: Date.now(),
						// ip: ip,
						viewPage: window.location.href,
						fromPage: document.referrer
					}
				})
				$(window).on('action:ajaxify.end', function(ev, data) {
					console.log(data);
					viewPage = data.url;
					$.getJSON('//freegeoip.net/json/?callback=?', function(dataIP) {
						ip = dataIP.ip;
						$.ajax({
							type: "POST",
							url: apiUrl,
							data: { 
								platform: navigator.platform,
								appVersion: navigator.appVersion,
								language: navigator.language,
								time: new Date(),
								now: Date.now(),
								ip: ip,
								viewPage: data.url,
								fromPage: document.referrer
							}
						})
					});
				});

			}).fail(function() {
				if (window.console) {
					//console.warn('[plugins/google-analytics] Your Google Analytics Asset ID could not be retrieved. Please double-check that it is set in the plugin\'s settings.');
				}
			});

			$(window).on("unload", function(e) {
				endTime = Date.now();
				$.ajax({ 
					type: "POST",
					url: apiUrl,
					data: {
						timeSpent: endTime - startTime,
						url: viewPage
					}
				})
			});
		}
	})
});
