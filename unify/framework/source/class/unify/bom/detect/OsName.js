/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/**
 * Detects the operating system name
 */
core.Module("unify.bom.detect.OsName", {
  
  /** {=String} One of "win", "mac", "unix", "android", "ios", "webos", "qnx" */
	VALUE : (function(navigator) {
    var userAgent = navigator.userAgent;
    var input = navigator.platform || userAgent;
    var name;
  
    if (/Windows|Win32|Win64/.exec(input)) {
      name = "win";
    } else if (/webOS/.exec(userAgent)) {
      name = "webos";
    } else if (/iPad|iPhone|iPod/.exec(input)) {
      name = "ios";
    } else if (/Macintosh|MacPPC|MacIntel|Mac OS/.exec(input)) {
      name = "mac";
    } else if (/Android/.exec(input)) {
      name = "android";
    } else if (/X11|Linux|BSD|Sun OS|Maemo|SymbianOS/.exec(input)) {
      name = "unix";
    } else if (/RIM Tablet OS/.exec(userAgent)) {
      name = "qnx";
    }
    
		return name;
	})(this.navigator)
});
