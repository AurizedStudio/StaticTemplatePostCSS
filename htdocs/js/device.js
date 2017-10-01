// User Agent Checker
// v0.1.0
// -----------------------------------------------------------

+(function () {
  _uac = {}; // define _uac as a global object
  var ua = window.navigator.userAgent.toLowerCase();
  var ver = window.navigator.appVersion.toLowerCase();
  var ua2 = window.navigator.userAgent;

  // check browser version
  _uac.browser = (function(){
      if (ua.indexOf('edge') !== -1) return 'edge';                           // Edge
      else if (ua.indexOf("iemobile") !== -1)      return 'iemobile';         // ieMobile
      else if (ua.indexOf('trident/7') !== -1)     return 'ie11';             // ie11
      else if (ua.indexOf("msie") !== -1 && ua.indexOf('opera') === -1){
          if      (ver.indexOf("msie 6.")  !== -1) return 'ie6';              // ie6
          else if (ver.indexOf("msie 7.")  !== -1) return 'ie7';              // ie7
          else if (ver.indexOf("msie 8.")  !== -1) return 'ie8';              // ie8
          else if (ver.indexOf("msie 9.")  !== -1) return 'ie9';              // ie9
          else if (ver.indexOf("msie 10.") !== -1) return 'ie10';             // ie10
      }
      else if (ua.indexOf('chrome')  !== -1 && ua.indexOf('edge') === -1)   return 'chrome';    // Chrome
      else if (ua.indexOf('safari')  !== -1 && ua.indexOf('chrome') === -1) return 'safari';    // Safari
      else if (ua.indexOf('opera')   !== -1) return 'opera';                  // Opera
      else if (ua.indexOf('firefox') !== -1) return 'firefox';                // FIrefox
      else return 'unknown_browser';
  })();

  // check device
  _uac.device = (function(){
      if(ua.indexOf('iphone') !== -1 || ua.indexOf('ipod') !== -1 ) return 'iphone';
      else if (ua.indexOf('ipad')    !== -1) return 'ipad';
      else if (ua.indexOf('android') !== -1) return 'android';
      else if (ua.indexOf('windows') !== -1 && ua.indexOf('phone') !== -1) return 'windows_phone';
      else return '';
  })();

	// check PC platform
	_uac.pcplatform = (function(){
		if(ua2.indexOf('Windows') !== -1) return 'win';
		else if (ua2.indexOf('Macintosh') !== -1) return 'mac';
		else return '';
	})();

  // check ios version
  _uac.iosVer = (function(){
      if ( /iP(hone|od|ad)/.test( navigator.platform ) ) {
          var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
          var versions = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
          return versions[0];
      }
      else return 0;
  })();

  _uac.isiOS = (_uac.device === 'iphone' || _uac.device === 'ipad');
  _uac.isMobile = (ua.indexOf('mobi') !== -1 || _uac.device === 'iphone' || (_uac.device === 'windows_phone' && ua.indexOf('wpdesktop') === -1) || _uac.device === 'iemobile');
  _uac.isTablet = (_uac.device === 'ipad' || (_uac.device === 'android' && !_uac.isMobile));
  _uac.isTouch  = ('ontouchstart' in window);
  _uac.isModern = !(_uac.browser === 'ie6' || _uac.browser === 'ie7' || _uac.browser === 'ie8' || _uac.browser === 'ie9' || (0 < _uac.iosVer && _uac.iosVer < 8));

  // Set the results as class names of the html
  _uac.addClass = function() {
    var home_class = ' ';
    home_class += (_uac.browser !== '') ? _uac.browser + " " : 'browser-unknown ',
    home_class += (_uac.device  !== '') ? _uac.device + " "  : 'device-unknown ',
    home_class += (_uac.pcplatform  !== '') ? _uac.pcplatform + " "  : 'pcplatform-unknown ',
    home_class += (_uac.isMobile) ? 'mobile ' : 'desktop ',
    home_class += (_uac.isTouch) ? 'touch '  : 'mouse ',
    home_class += (_uac.isModern) ? 'modern ' : 'old ';

    document.addEventListener('DOMContentLoaded', function() {
      document.documentElement.className += home_class;
    });
  };
  _uac.addClass();

})();