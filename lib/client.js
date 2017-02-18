"use strict";
/* global socket */

$(document).ready(function() {

	var analyticActivate, apiUrl;
	var viewPage, uid, url, location;

	url = window.location.href.substr(0, window.location.href.indexOf(RELATIVE_PATH));
	location = url + RELATIVE_PATH + '/';
	$.get(RELATIVE_PATH + '/api').done(function(api) {
		if (api.loggedIn) {
			$.get(RELATIVE_PATH + '/api/me').done(function(me) {
				// loggedIn
				$.get(RELATIVE_PATH + '/api/plugins/analytics').done(function(config) {
					analyticActivate = config.activate_analytic;
					apiUrl = config.api_url;

					if(analyticActivate === 'on'){
						var ip, endTime;
						var startTime = Date.now();
						var viewPage;

						if (window.location.href.includes(location) && window.location.href.length == location.length){
							viewPage = 'mainPage'
						} else {
							viewPage = window.location.href.replace(location, '');
						}
							$.getJSON('//freegeoip.net/json/?callback=?', function(dataIP) {
								//first time load page
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
										viewPage: viewPage,
										fromPage: document.referrer,
										uid: me.uid,
										userName: me.username
									}
								})
							})
							$(window).on('action:ajaxify.end', function(ev, data) {
								//not first time load page
								viewPage = data.url;
								if (data.url  == ""){
									data.url = 'mainPage';
								}
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
											fromPage: document.referrer,
											uid: me.uid,
											userName: me.username
										}
									})
								});
							});
						// }).fail(function() {
						// 	if (window.console) {
						// 		//console.warn('[plugins/google-analytics] Your Google Analytics Asset ID could not be retrieved. Please double-check that it is set in the plugin\'s settings.');
						// 	}
						// });

						// $(window).on("unload", function(e) {
						// 	endTime = Date.now();
						// 	$.ajax({
						// 		type: "POST",
						// 		url: apiUrl,
						// 		data: {
						// 			timeSpent: endTime - startTime,
						// 			leaveFromUrl: viewPage
						// 		}
						// 	})
						// });
					}
				})
				// })
			})
		} else {
			// not loggedIn
			$.get(RELATIVE_PATH + '/api/plugins/analytics').done(function(config) {
				if (window.location.href.includes(location) && window.location.href.length == location.length){
					viewPage = 'mainPage'
				} else {
					viewPage = window.location.href.replace(location, '');
				}
				$.getJSON('//freegeoip.net/json/?callback=?', function(dataIP) {
					//first time load page
					ip = dataIP.ip;
					$.ajax({
						type: "POST",
						url: config.api_url,
						data: {
							platform: navigator.platform,
							appVersion: navigator.appVersion,
							language: navigator.language,
							time: new Date(),
							now: Date.now(),
							ip: ip,
							viewPage: viewPage,
							fromPage: document.referrer
						}
					})
				})
				$(window).on('action:ajaxify.end', function(ev, data) {
					//not first time load page
					viewPage = data.url;
					if (data.url  == ""){
						data.url = 'mainPage';
					}
					$.getJSON('//freegeoip.net/json/?callback=?', function(dataIP) {
						ip = dataIP.ip;
						$.ajax({
							type: "POST",
							url: config.api_url,
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
		}
	})
});
