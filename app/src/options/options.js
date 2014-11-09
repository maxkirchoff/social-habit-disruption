$(document).ready(function() {

  var Options = {
    _whitelistedSites: [],
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
    init: function() {
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
    }
  };

  Options.init();
});
