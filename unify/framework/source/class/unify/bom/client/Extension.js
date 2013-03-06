/*
===============================================================================================

		Unify Project

		Homepage: unify-project.org
		License: MIT + Apache (V2)
		Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

===============================================================================================
*/
/**
 * Detects plugins/addons which extends the normal features of a browser
 * like Adobe AIR, Mozilla Prism, etc.
 *
 * The listed constants are automatically filled on the initialization
 * phase of the class. The defaults listed in the API viewer need not
 * to be identical to the values at runtime.
 */
core.Module("unify.bom.client.Extension",
{
	/*
	----------------------------------------------------------------------------
		 STATICS
	----------------------------------------------------------------------------
	*/

	/** {Boolean} Whether the application is running inside a Adobe AIR package */
	AIR : navigator.userAgent.match(/adobeair/i) !== null,

	/** {Boolean} Whether the application is running inside a Mozilla Prism package */
	PRISM : jasy.Env.isSet("runtime", "browser") && (!!window.platform),

	/** {Boolean} Whether the application is running inside a Titanium Desktop package */
	TITANIUM : jasy.Env.isSet("runtime", "browser") && (!!window.Titanium),

	/** {Boolean} Whether the application is running inside a PhoneGap application right now. */
	PHONEGAP : jasy.Env.isSet("runtime", "browser") && (!!(window.PhoneGap || window.DroidGap)),

	/** {Boolean} Whether the BONDI API is supported */
	BONDI : jasy.Env.isSet("runtime", "browser") && (!!window.bondi)
});
