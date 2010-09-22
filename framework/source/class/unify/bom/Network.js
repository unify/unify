/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Basic network features
 */
qx.Class.define("unify.bom.Network",
{
	statics :
	{
		/**
		 * Returns <code>false</code> if the user agent is definitely offline (disconnected from the network).
		 * Returns <code>true</code> if the user agent might be online.
		 *
		 * @return {Boolean} Whether the client is connected to the internet
		 */
		isOnline : function() {
			return window.navigator.onLine;
		}		
	}
});
