"use strict";
/* global socket */

$(document).ready(function() {

	var analyticActivate, apiUrl;
	var viewPage, uid, url, location, category, categoryName, topicName;
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
						category = viewPage.split('/')[0];
						//first time load page
						if(category == 'category'){
							var cid = viewPage.split('/')[1];
							$.get(RELATIVE_PATH + '/api/category/' + cid).done(function(category) {
								categoryName = category.name;
								$.getJSON('//freegeoip.net/json/?callback=?', function(dataIP) {
									ip = dataIP.ip;
									var topicName;
									ajaxLogin(apiUrl, navigator, viewPage, me, cid, tid, categoryName, topicName, ip)
								})
							})
						} else if(category == 'topic'){
							var tid = viewPage.split('/')[1];
							$.get(RELATIVE_PATH + '/api/topic/' + tid).done(function(topic) {
								$.get(RELATIVE_PATH + '/api/category/' + topic.cid).done(function(category) {
									$.getJSON('//freegeoip.net/json/?callback=?', function(dataIP) {
										ip = dataIP.ip;
										ajaxLogin(apiUrl, navigator, viewPage, me, topic.cid, tid, category.name, topic.title, ip)
									})
								})
							})
						} else {
							$.getJSON('//freegeoip.net/json/?callback=?', function(dataIP) {
								ip = dataIP.ip;
								var categoryName, topicName;
								ajaxLogin(apiUrl, navigator, viewPage, me, cid, tid, categoryName, topicName, ip)
							})
						}
						$(window).on('action:ajaxify.end', function(ev, data) {
							//not first time load page
							if (data.url  == ""){
								data.url = 'mainPage';
							}
							viewPage = data.url;
							category = viewPage.split('/')[0];
							if(category == 'category'){
								var cid = viewPage.split('/')[1];
								$.get(RELATIVE_PATH + '/api/category/' + cid).done(function(category) {
									categoryName = category.name;
									$.getJSON('//freegeoip.net/json/?callback=?', function(dataIP) {
										ip = dataIP.ip;
										var topicName;
										ajaxLogin(apiUrl, navigator, viewPage, me, cid, tid, categoryName, topicName, ip)
									})
								})
							} else if(category == 'topic'){
								var tid = viewPage.split('/')[1];
								$.get(RELATIVE_PATH + '/api/topic/' + tid).done(function(topic) {
									$.get(RELATIVE_PATH + '/api/category/' + topic.cid).done(function(category) {
										$.getJSON('//freegeoip.net/json/?callback=?', function(dataIP) {
											ip = dataIP.ip;
											ajaxLogin(apiUrl, navigator, viewPage, me, topic.cid, tid, category.name, topic.title, ip)
										})
									})
								})
							} else {
								$.getJSON('//freegeoip.net/json/?callback=?', function(dataIP) {
									ip = dataIP.ip;
									var categoryName, topicName;
									ajaxLogin(apiUrl, navigator, viewPage, me, cid, tid, categoryName, topicName, ip)
								});
							}
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
				category = viewPage.split('/')[0];
				console.log(config);
				if(category == 'category'){
					var cid = viewPage.split('/')[1];
					$.get(RELATIVE_PATH + '/api/category/' + cid).done(function(category) {
						categoryName = category.name;
						$.getJSON('//freegeoip.net/json/?callback=?', function(dataIP) {
							//first time load page
							ip = dataIP.ip;
							var topicName;
							ajaxNonLogin(config, navigator, viewPage, cid, tid, categoryName, topicName, ip)
						})
					})
				} else if(category == 'topic'){
					var tid = viewPage.split('/')[1];
					$.get(RELATIVE_PATH + '/api/topic/' + tid).done(function(topic) {
						$.get(RELATIVE_PATH + '/api/category/' + topic.cid).done(function(category) {
							$.getJSON('//freegeoip.net/json/?callback=?', function(dataIP) {
							//first time load page
								ip = dataIP.ip;
								ajaxNonLogin(config, navigator, viewPage, topic.cid, tid, category.name, topic.title, ip)
							})
						})
					})
				} else {
					$.getJSON('//freegeoip.net/json/?callback=?', function(dataIP) {
					ip = dataIP.ip;
						var categoryName, topicName;
						ajaxNonLogin(config, navigator, viewPage, cid, tid, categoryName, topicName, ip)
					});
				}
				$(window).on('action:ajaxify.end', function(ev, data) {
					//not first time load page
					if (data.url  == ""){
						data.url = 'mainPage';
					}
					viewPage = data.url;
					category = viewPage.split('/')[0];
					if(category == 'category'){
						var cid = viewPage.split('/')[1];
						$.get(RELATIVE_PATH + '/api/category/' + cid).done(function(category) {
							categoryName = category.name;
							$.getJSON('//freegeoip.net/json/?callback=?', function(dataIP) {
								//first time load page
								ip = dataIP.ip;
								var topicName;
								ajaxNonLogin(config, navigator, viewPage, cid, tid, categoryName, topicName, ip)
							})
						})
					} else if(category == 'topic'){
						var tid = viewPage.split('/')[1];
						$.get(RELATIVE_PATH + '/api/topic/' + tid).done(function(topic) {
							$.get(RELATIVE_PATH + '/api/category/' + topic.cid).done(function(category) {
								$.getJSON('//freegeoip.net/json/?callback=?', function(dataIP) {
								//first time load page
									ip = dataIP.ip;
									ajaxNonLogin(config, navigator, viewPage, topic.cid, tid, category.name, topic.title, ip)
								})
							})
						})
					} else {
						$.getJSON('//freegeoip.net/json/?callback=?', function(dataIP) {
							ip = dataIP.ip;
							var categoryName, topicName;
							ajaxNonLogin(config, navigator, viewPage, cid, tid, categoryName, topicName, ip)
						});
					}
				});
			});
			// }).fail(function() {
			// 	if (window.console) {
			// 		//console.warn('[plugins/google-analytics] Your Google Analytics Asset ID could not be retrieved. Please double-check that it is set in the plugin\'s settings.');
			// 	}
			// });
		}
	})

	function ajaxLogin(apiUrl, navigator, viewPage, me, cid, tid, categoryName, topicName, ip) {
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
				userName: me.username,
				cid: cid,
				tid: tid,
				categoryName: categoryName,
				topicName: topicName
			}
		})
	}

	function ajaxNonLogin(config, navigator, viewPage, cid, tid, categoryName, topicName, ip) {
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
				fromPage: document.referrer,
				cid: cid,
				tid: tid,
				categoryName: categoryName,
				topicName: topicName
			}
		})
	}
});
