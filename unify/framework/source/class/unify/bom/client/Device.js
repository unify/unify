/*
===============================================================================================

		Unify Project

		Homepage: unify-project.org
		License: MIT + Apache (V2)
		Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

===============================================================================================
*/
/**
 * Detects the device on which the application is running.
 *
 * * Desktop: Classical desktop power house e.g. MacBook, Dell Workstation, etc.
 * * Mobile: Advanced smartphone
 * * Tablet: Device based on touch optimized (mobile) operating system with a large screen
 * * Basic: Embedded device, basic phone device, etc.
 */
core.Module("unify.bom.client.Device",
{
	/*
	----------------------------------------------------------------------------
		 STATICS
	----------------------------------------------------------------------------
	*/

		/** {String} Used to categorize different devices/browsers into groups. One of: "desktop", "mobile" or "phone" */
		CATEGORY : "desktop",

		/** {Boolean} Whether the device is a powerful desktop machine, notebook etc. ... */
		DESKTOP : false,

		/** {Boolean} Whether the device is a touch screen device, but not a smartphone or desktop machine */
		TABLET : false,

		/** {Boolean} A so-named smartphone with excellent browsing capabilities. */
		MOBILE : false,

		/** {Boolean} A simple device with only basic browsing capabilities */
		BASIC : false

});

(function(statics) {
	var Extension = unify.bom.client.Extension;
	var category = "desktop";

	// Desktop Widgets based on AIR, Prism or Titanium
	if (!(Extension.AIR || Extension.PRISM || Extension.TITANIUM))
	{
		var agent = navigator.userAgent;

		if (agent.match(/RIM Tablet OS/i)) {
			category = "tablet";
		}

		// Mozilla Fennec, Opera Mobile
		// or Webkit-based clients which have a Mobile/ or Bolt/ string in them
		// Bolt is a server-side rendering client based on Webkit
		else if (agent.match(/Fennec|Opera Mobi/i) || (agent.match(/AppleWebKit\/5/i) && agent.match(/Mobile\b/i) && !agent.match(/Bolt\//i))) {
			category = "mobile";

			if (navigator.platform == "iPad") {
				category = "tablet";
			}
		}

		// Not so powerful mobile devices with basic or thin client browsers
		// IE Mobile, BlackBerry Browser, Netfronts, Windows CE-devices, Java-based browsers, Opera Mini, Bolt Browser
		else if (agent.match(/IEMobile|Mobile|BlackBerry|Netfront|Bolt|Mini|Palm|Windows CE|CLDC|MIDP/i)) {
			category = "basic";
		}
	}

	statics[category.toUpperCase()] = true;
	statics.CATEGORY = category;
})(unify.bom.client.Device);