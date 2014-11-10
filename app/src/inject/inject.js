chrome.extension.sendMessage({}, function(response) {
	var Disruptor = {
		_siteExceptions: {
			'facebook.com': ['developers.facebook.com'],
			'google.com': ['plus.google.com/hangouts']
		},
		_popUpVisible: false,
		_getMessage: chrome.i18n.getMessage,
		_onlyDuringBusinessHours: false,
		_triggerDelayTimer: function(delay) {
			var that = this,
				now = new Date().getTime(),
				delayUntil = now + delay;
			chrome.storage.sync.set({delayUntil: delayUntil}, function () {
				that._hidePopUp();
			});
		},
		_delayChecker: function() {
			var that = this;
			var check = function() {
				chrome.storage.sync.get('delayUntil', function(obj) {
					var now = new Date().getTime();
					if (now >= obj.delayUntil || obj.delayUntil === undefined) {
						if (!that._popUpVisible) {
							that._showPopUp();
						}
					} else {
						if (that._popUpVisible) {
							that._hidePopUp();
						}
					}
				});
			};
			check();
			setInterval(check, 15000);
		},
		_getPopUpHTML: function() {
			var minutes = [5, 10, 15, 30, 45],
				minuteOptionsHTML = "";
			for (var i = 0; i < minutes.length; i++) {
				minuteOptionsHTML += "<option value='" + minutes[i] * 60 * 1000 + "'>" + minutes[i] + "</option>";
			}
			var randomStatementIndex = 'l10nStatement'+(Math.floor(Math.random()*3)+1);
			return "<div id='shd-overlay'></div>" +
				"<div id='shd'>" +
				"<div class='denied'></div>" +
				"<div class='statement'>" +
				this._getMessage(randomStatementIndex) +
				"</div>" +
				"<div class='go-away'>" +
				this._getMessage('l10nPreMinuteSelect') +
				"<select name='minutes'>" +
				minuteOptionsHTML +
				"</select> " +
				this._getMessage('l10nMinutes') +
				"<button class='delay-submit'>" + this._getMessage('l10nMinuteDelaySubmit') + "</button>" +
				"</div>" +
				"</div>";
		},
		_showPopUp: function() {
			var that = this,
				$body = $('body');
			$body.append(this._getPopUpHTML());
			$('#shd-overlay').fadeIn();
			var $shd = $('#shd');
			$shd.fadeIn();
			$shd.find('button.delay-submit').on('click', function (e) {
				e.preventDefault();
				var delay = parseInt($('#shd').find('select[name=minutes]').val());
				if (delay !== undefined && delay > 0) {
					that._triggerDelayTimer(delay);
				}
			});
			$body.addClass('blur-body');
			this._popUpVisible = true;
		},
		_hidePopUp: function() {
			$('#shd-overlay').remove();
			$('#shd').remove();
			$('body').removeClass('blur-body');
			this._popUpVisible = false;
		},
		_isSiteException: function(site) {
			var currFullPath = window.location.href;
			if (this._siteExceptions[site][0] !== undefined) {
				for (var i=0; i < this._siteExceptions[site].length; i++) {
					if (currFullPath.indexOf(this._siteExceptions[site][i]) > -1) {
						return true;
					}
				}
			}
		},
		init: function() {
			var that = this;
			chrome.storage.sync.get('whitelistedSites', function(obj) {
				if (obj.whitelistedSites === undefined) {
					obj.whitelistedSites = [];
				}
				var currSite = window.location.hostname.split('.').slice(-2).join('.');
				if ($.inArray(currSite, obj.whitelistedSites) === -1) {
					if (!that._isSiteException(currSite)) {
						that._delayChecker();
					}
				}
			});
		}
	};
	// Get it moving
	Disruptor.init();
});