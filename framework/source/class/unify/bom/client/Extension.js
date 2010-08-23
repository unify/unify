/* ************************************************************************

	 Unify Framework

	 Copyright:
		 2009 Deutsche Telekom AG, Germany, http://telekom.com

************************************************************************ */

/**
 * Detects plugins/addons which extends the normal features of a browser
 * like Adobe AIR, Mozilla Prism, etc.
 *
 * The listed constants are automatically filled on the initialization
 * phase of the class. The defaults listed in the API viewer need not
 * to be identical to the values at runtime.
 */
qx.Bootstrap.define("unify.bom.client.Extension",
{
	/*
	*****************************************************************************
		 STATICS
	*****************************************************************************
	*/

	statics :
	{
		/** {Boolean} Whether the application is running inside a Adobe AIR package */
		AIR : navigator.userAgent.match(/adobeair/i) !== null,

		/** {Boolean} Whether the application is running inside a Mozilla Prism package */
		PRISM : !!window.platform,

		/** {Boolean} Whether the application is running inside a Titanium Desktop package */
		TITANIUM : !!window.Titanium,

		/** {Boolean} Whether the application is running inside a PhoneGap application right now. */
		PHONEGAP : !!(window.PhoneGap || window.DroidGap),

		/** {Boolean} Whether the BONDI API is supported */
		BONDI : !!window.bondi
	}
});
