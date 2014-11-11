$(document).ready(function() {

  var Options = {
    _times: [],
    _days: [],
    _whitelistedSites: [],
    _saveTimes: function() {
      console.log("saving times");
      chrome.storage.sync.set({times: this._times}, function() {
        $('#saved').fadeIn(1000, function() {
          $('#saved').fadeOut();
        });
      });
    },
    _addTime: function(time) {
      if ($.inArray(time, this._times) < 0) {
        this._times.push(time);
        this._saveTimes();
      }
    },
    _removeTime: function(time) {
      if ($.inArray(time, this._times) > -1) {
        this._times.splice($.inArray(time, this._times), 1);
        this._saveTimes();
      }
    },
    _saveDays: function() {
      console.log("saving days");
      chrome.storage.sync.set({days: this._days}, function() {
        $('#saved').fadeIn(1000, function() {
          $('#saved').fadeOut();
        });
      });
    },
    _addDay: function(day) {
      if ($.inArray(day, this._days) < 0) {
        this._days.push(day);
        this._saveDays();
      }
    },
    _removeDay: function(day) {
      if ($.inArray(day, this._days) > -1) {
        this._days.splice($.inArray(day, this._days), 1);
        this._saveDays();
      }
    },
    _saveWhitelistedSites: function() {
      console.log("saving whitelist");
      chrome.storage.sync.set({whitelistedSites: this._whitelistedSites}, function() {
        $('#saved').fadeIn(1000, function() {
          $('#saved').fadeOut();
        });
      });
    },
    _addWhitelistedSite: function(site) {
      if ($.inArray(site, this._whitelistedSites) < 0) {
        this._whitelistedSites.push(site);
        this._saveWhitelistedSites();
      }
    },
    _removeWhitelistedSite: function(site) {
      if ($.inArray(site, this._whitelistedSites) > -1) {
        this._whitelistedSites.splice($.inArray(site, this._whitelistedSites), 1);
        this._saveWhitelistedSites();
      }
    },
    _getHourObj: function() {
      var hoursObj = {};
      for (var i = 0; i < 24; i++) {
        var meridiem = i < 12 ? 'am' : 'pm';
        var displayHour = i < 12 ? i : i-12;
        hoursObj[i] = (displayHour===0 ? '12' : displayHour) + meridiem;
      }
      return hoursObj;
    },
    _addTimeSelects: function() {
      var hours = this._getHourObj();

      $('#days-times').find('.times').each(function() {
        var that = this,
          hourCheckboxes = "";
        $.each( hours, function( key, value ) {
          hourCheckboxes += "<label><input type='checkbox' name='time' value='" + $(that).attr('data-day') + "-" + key + "' checked='checked' />" + value + "</label>";
        });

        $(this).append(hourCheckboxes);
      });

      $('a.show-times').on('click', function(e) {
        e.preventDefault();
        if ($(this).hasClass('selected')) {
          $('div[data-day=' + $(this).attr('data-day') + ']').hide();
          $(this).html('show times').removeClass('selected');
        } else {
          $('div[data-day=' + $(this).attr('data-day') + ']').show().addClass('selected');
          $(this).html('hide times').addClass('selected');
        }
      });
    },
    _setupDayAndTimeSelects: function() {
      var that = this;

      this._addTimeSelects();
      $('input[name=day]').attr('checked','checked');

      chrome.storage.sync.get('days', function(obj) {
        if (obj.days !== undefined) {
          that._days = obj.days;
          for (var i=0;i<obj.days.length;i++) {
            $('input[name="day"][value="' + obj.days[i] + '"]').removeAttr('checked');
          }
        }
        $('input[name=day]').on('change', function() {
          if (this.checked) {
            that._removeDay($(this).val());
          } else {
            that._addDay($(this).val());
          }
        });
      });
      chrome.storage.sync.get('times', function(obj) {
        if (obj.times !== undefined) {
          that._times = obj.times;
          for (var i=0;i<obj.times.length;i++) {
            $('input[name="time"][value="' + obj.times[i] + '"]').removeAttr('checked');
          }
        }
        $('input[name=time]').on('change', function() {
          if (this.checked) {
            that._removeTime($(this).val());
          } else {
            that._addTime($(this).val());
          }
        });
      });
    },
    _setupSiteSelects: function() {
      var that = this;
      $('input[name=whitelisted-site]').attr('checked','checked');
      chrome.storage.sync.get('whitelistedSites', function(obj) {
        if (obj.whitelistedSites !== undefined) {
          that._whitelistedSites = obj.whitelistedSites;
          for (var i=0;i<obj.whitelistedSites.length;i++) {
            $('input[name="whitelisted-site"][value="' + obj.whitelistedSites[i] + '"]').removeAttr('checked');
          }
        }
        $('input[name=whitelisted-site]').on('change', function() {
          if (this.checked) {
            that._removeWhitelistedSite($(this).val());
          } else {
            that._addWhitelistedSite($(this).val());
          }
        });
      });
    },
    init: function() {
      this._setupDayAndTimeSelects();
      this._setupSiteSelects();
    }
  };

  Options.init();
});
