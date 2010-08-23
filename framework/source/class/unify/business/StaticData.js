/* ************************************************************************

	 Unify Framework

	 Copyright:
		 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

************************************************************************ */

/**
 * Basic data related business object to offline available data 
 * (compiled into script block for example)
 */
qx.Class.define("unify.business.StaticData",
{
	extend : qx.core.Object,


	/*
	*****************************************************************************
		 CONSTRUCTOR
	*****************************************************************************
	*/
	
	// overridden
	construct : function()
	{
		this.base(arguments);
		
		// Initialize service list
		this.__services = {};
	},

	
	
	/*
	*****************************************************************************
		 MEMBERS
	*****************************************************************************
	*/
	
	members :
	{
		/*
		---------------------------------------------------------------------------
			PUBLIC API
		---------------------------------------------------------------------------
		*/		
		
		/**
		 * Returns data from the given service
		 * 
		 * @param service {String} One the supported services
		 * @param params {Map?null} Optional map of params
		 * @return {var} Service data
		 */
		read : function(service, params)
		{
			if (qx.core.Variant.isSet("qx.debug", "on")) 
			{
				if (!service || !this.__services[service]) {
					throw new Error("Unsupported service: " + service);
				}				
			}
			
			return this._readData(service, params);
		},
		
		
		
		/*
		---------------------------------------------------------------------------
			PROTECTED API
		---------------------------------------------------------------------------
		*/		
		
		/** {Map} Dictionary of all supported services */
		__services : null,
		
		
		/**
		 * Adds the given service
		 * 
		 * @param service {String} Unique name of service
		 * @param config {Map} Optional service configuration
		 */
		_addService : function(service, config) 
		{
			var db = this.__services;
			if (qx.core.Variant.isSet("qx.debug", "on"))
			{
				if (db[service]) {
					throw new Error("Service " + service + " is already registered!");
				}			
			}
			
			db[service] = config || {};
		},
		
		
		/**
		 * Returns the service configuration of the given service
		 * 
		 * @param service {String} Name of service
		 * @return {Map} Configuration map
		 */
		_getService : function(service)
		{
			var config = this.__services[service];
			if (qx.core.Variant.isSet("qx.debug", "on"))
			{
				if (!config) {
					throw new Error("Unknown service: " + service);
				}
			}

			return config;
		},
		
		
		/**
		 * Returns data as stored in cache for the given service.
		 * 
		 * Please keep in mind that the data returned by this function might
		 * be old (e.g. last check was some time ago).
		 * 
		 * @param service {String} One the supported services
		 * @param params {Map?null} Optional map of params
		 * @return {var|null} Cached data or <code>null</code> if nothing is cached
		 */
		_readData : function(service, params) {
			throw new Error("Please implement _readData()!");
		}
	}
});
