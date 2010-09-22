/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Newly written history managment optimized for Webkit (at the moment).
 *
 * * Supports back and forward events in history which is helpful for iPhone-like layer navigation.
 */
qx.Class.define("unify.bom.History",
{
	extend : qx.core.Object,
	type : "singleton",


	/*
	*****************************************************************************
		 CONSTRUCTOR
	*****************************************************************************
	*/

	construct : function()
	{
		this.base(arguments);
		
		// Init callback
		this.__onCallbackWrapped = qx.lang.Function.bind(this.__onCallback, this);
			
		// HTML5 hashchange supported by IE>=8, Firefox>=3.6, Webkit (!Safari 4)
		// See also: https://bugs.webkit.org/show_bug.cgi?id=21605
		// https://developer.mozilla.org/en/DOM/window.onhashchange
		if (qx.bom.Event.supportsEvent(window, "hashchange")) {
			qx.bom.Event.addNativeListener(window, "hashchange", this.__onCallbackWrapped);
		} else {
			this.__intervalHandler = window.setInterval(this.__onCallbackWrapped, 100);
		}
	},



	/*
	*****************************************************************************
		 EVENTS
	*****************************************************************************
	*/

	events :
	{
		/** Fired every time the history is modified */
		change : "unify.event.type.History"
	},



	/*
	*****************************************************************************
		 PROPERTIES
	*****************************************************************************
	*/

	properties :
	{
		/** The current location */
		location :
		{
			check : "String",
			nullable : true,
			apply : "_applyLocation"
		}
	},




	/*
	*****************************************************************************
		 MEMBERS
	*****************************************************************************
	*/

	members :
	{
		/** {Timer} Handle for timeout */
		__intervalHandler : null,
		
		/** {Function} Wrapped callback method */
		__onCallbackWrapped : null,
		
		
		/**
		 * Change hash to the given hash. Completely replaces current location.
		 * 
		 * @param location {String} A valid URL hash without leading "#".
		 */
		jump : function(location)
		{
			location = window.encodeURI(location);
			
			// Apply property first, to ignore browser hash change afterwards
			this.setLocation(location);

			// Verify that we are still at the same location.
			// This might be different already because setLocation fires
			// an event and might result in a post modification of the
			// location.
			if (location == this.getLocation()) {
				window.location.hash = "#" + location;
			}
		},
		
		
		/**
		 * Should be called after the page is loaded to
		 * show the the content based on the loaded hash
		 * or go to the default screen.
		 * 
		 * @param defaultPath {String} Default path to jump to, 
		 *   when no one is given through URL
		 */
		init : function(defaultPath)
		{
			if (location.hash) {
				this.setLocation(location.hash.substring(1));
			} else {
				this.jump(defaultPath);
			}
		},




		/*
		---------------------------------------------------------------------------
			INTERNALS
		---------------------------------------------------------------------------
		*/

		// property apply method
		_applyLocation : function(value, old) {
			this.fireEvent("change", unify.event.type.History, [value, old]);
		},


		/**
		 * Internal listener for interval. Used to check for history changes. Converts
		 * the native changes to the instance and fires synthetic events to the outside.
		 *
		 * @param e {Event} Native interval event
		 */
		__onCallback : function(e)
		{
			var current = location.hash.substring(1);
			if (current !== this.getLocation()) 
			{
				this.debug("Native Changed: '" + current + "'");
				this.setLocation(current);
			}
		}
	},



	/*
	*****************************************************************************
		 DESTRUCTOR
	*****************************************************************************
	*/

	destruct : function()
	{
		if (this.__intervalHandler)
		{
			window.clearInterval(this.__intervalHandler);
			this.__intervalHandler = null;
		}
	}
});
