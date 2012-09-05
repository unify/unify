/*
===============================================================================================

		Unify Project

		Homepage: unify-project.org
		License: MIT + Apache (V2)
		Copyright: 2012, Stefan Kolb <stefan.kolb at indiginox.com>
		
		Modified by Sebastian Fastner, Mainz, Germany, http://unify-training.com
		
===============================================================================================
*/

(function() {

	var eventName = document.cancelFullScreen ? ' fullscreenchange' :
									document.mozCancelFullScreen ? 'mozfullscreenchange' :
									document.webkitCancelFullScreen ? 'webkitfullscreenchange' :
									null;


	
	
	/*
	----------------------------------------------------------------------------
		PUBLIC
	----------------------------------------------------------------------------
	*/
	
	/**
	 * Is fullscreen supported?
	 *
	 * Tries to determine whether or not fullscreen mode is supported by the
	 * browser.
	 *
	 * @return {Boolean} true: the browser supports fullscreen;
	 *                   false: otherwise
	 */
	var isSupported = function() {
		var isGoogleChromeFrame = !!window.externalHost;
		var supportedEngines = [ 'webkit', 'gecko' ];
		
		// Firstly, we check if we are currently in Google Chrome Frame
		// Unfortunatley, Google Chrome Frame exposes the fullscreen API methods,
		// but executing them will in fact do nothing
		if (isGoogleChromeFrame) {
			return false;
		}
		
		// Secondly, we check for a supported browser engine
		if (!(supportedEngines.contains(core.Env.getValue('engine')))) {
			return false;
		}
		
		// Thirdly, we check if the required method(s) are available.
		// We only check for the method to cancel/exit fullscreen;
		// Assumption:
		//  If the cancel/exit method is there, the method to enter fullscreen mode
		//  is available as well.)
		if (document.cancelFullScreen ||
				document.mozCancelFullScreen ||
				document.webkitCancelFullScreen) {
			return true;
		}
		
		return false;
	};
	
	
	/**
	 * Is fullscreen enabled?
	 *
	 * Check whether or not the browser is in a state that would allow fullscreen.
	 * 
	 * @return {Boolean} true: fullscreen is enabled;
	 *                   false: otherwise
	 */
	var isEnabled = function() {
		var isEnabled = !!document.fullScreenEnabled ||
										!!document.mozFullScreenEnabled ||
										!!document.webkitCancelFullScreen;  // webkit has no
																												// dedicated method to
																												// check if fullscreen
																												// is enabled
		
		return isEnabled;
	};
	
	
	/**
	 * Currently in fullscreen?
	 *
	 * Checks whether ot not the browser is currently in fullscreen mode.
	 *
	 * @return {Boolean} true: the browser is currently in fullscreen mode;
	 *                   false otherwise
	 */
	var isFullscreen = function() {
		if ((document.fullScreenElement && document.fullScreenElement != null) ||
				document.mozFullScreen || document.webkitIsFullScreen) {
			return true;
		}
		
		return false;
	};
	
	
	/**
	 * Add change listener
	 *
	 * Small helper method to add an event listener for the fullscreen change
	 * event available in the currently used browser, e.g.
	 * fullscreenchange, mozfullscreenchange etc.
	 *
	 * @see #__getFullscreenChangeEventName
	 * @param callback {Function} Callback to execute after fullscreen change
	 */
	var addChangeListener = function(callback) {
		if (!eventName) return;
		
		lowland.bom.Events.set(document, eventName, callback);
	};
	
	
	/**
	 * Remove change listener
	 *
	 * Small helper method to remove an event listener for the fullscreen change
	 * event available in the currently used browser, e.g.
	 * fullscreenchange, mozfullscreenchange etc.
	 *
	 * @see #__getFullscreenChangeEventName
	 * @param callback {Function} Callback to remove
	 */
	var removeChangeListener = function(callback) {
		if (!eventName) return;
		
		lowland.bom.Events.unset(document, eventName, callback);
	};
	
	
	/**
	 * Enter/Start fullscreen mode
	 *
	 * Enters fullscreen mode and sets the provided DOM node as the root element
	 * for the fullscreen mode.
	 *
	 * @param node {Element} A DOM node that should function as root element
	 *                       for the fullscreen mode
	 */
	var enter = function(node) {
		if (node.requestFullScreen) {
			node.requestFullScreen();
		} else if (node.mozRequestFullScreen) {
			node.mozRequestFullScreen();
		} else if (node.webkitRequestFullScreen) {
			node.webkitRequestFullScreen();
		}
	};
	
	
	/**
	 * Exit/Canel fullscreen mode
	 *
	 * Cancels fullscreen mode and returns to normal/windowed mode
	 */
	var exit;
	if (document.cancelFullScreen) {
		exit = document.cancelFullScreen;
	} else if (core.Env.isSet("engine", "gecko") && document.mozCancelFullScreen) {
		exit = document.mozCancelFullScreen;
	} else if (core.Env.isSet("engine", "webkit") && document.webkitCancelFullScreen) {
		exit = document.webkitCancelFullScreen;
	}
	
	
	/**
	 * Toggle fullscreen mode
	 *
	 * Toggles fullscreen mode, i.e. if the browser is currently in fullscreen
	 * mode, it switches to normal/windowed mode and if the browser is in
	 * normal/windowed mode, it switches to fullscreen mode.
	 *
	 * @param node {Element} A DOM node that should function as root element
	 *                       for the fullscreen mode
	 */
	var toggle = function(node) {
		if (isFullscreen()) {
			exit();
		} else {
			enter(node);
		}
	};
	
	/**
	 * Fullscreen support
	 *
	 * Module to utilize the W3C Fullscreen API (if the browser supports it.)
	 *
	 * @see http://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html
	 */
	core.Module('unify.bom.Fullscreen', {
		isSupported: isSupported,
		isEnabled: isEnabled,
		isFullscreen: isFullscreen,
		addChangeListener: addChangeListener,
		removeChangeListener: removeChangeListener,
		enter: enter,
		exit: exit,
		toggle: toggle
	});

})();
