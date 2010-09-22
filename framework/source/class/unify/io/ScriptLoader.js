/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/* ************************************************************************

#require(unify.io.Uri)

************************************************************************ */

/**
 * Loading of local or remote scripts.
 *
 * * Supports cross-domain communication
 * * Automatically "embeds" script so when the loaded event occours the new features are useable as well
 * * Clean ups automatically after the load, error or abort events
 *
 * Bug: http://bugzilla.qooxdoo.org/show_bug.cgi?id=2246
 */
qx.Class.define("unify.io.ScriptLoader",
{
	extend : qx.core.Object,


	/*
	*****************************************************************************
		 CONSTRUCTOR
	*****************************************************************************
	*/

	/**
	 * @param uri {String} URI to load
	 */
	construct : function(uri)
	{
		this.base(arguments);

		if (uri != null) {
			this.setUri(uri);
		}
	},




	/*
	*****************************************************************************
		 EVENTS
	*****************************************************************************
	*/

	events :
	{
		/** Fired when the script has been loaded successfully. */
		"load" : "qx.event.type.Data",

		/** Fired when the request resulted in an error. */
		"error" : "qx.event.type.Data",

		/** Fired when the request was aborted by the user. */
		"abort" : "qx.event.type.Data",

		/** Fired when request is finished */
		"done" : "qx.event.type.Event"
	},



	/*
	*****************************************************************************
		 PROPERTIES
	*****************************************************************************
	*/

	properties :
	{
		/** Load script from given URI */
		uri :
		{
			check : "unify.io.Uri",
			nullable : true
		}
	},



	/*
	*****************************************************************************
		 MEMBERS
	*****************************************************************************
	*/

	members :
	{
		/** {Boolean} Whether the request is running */
		__running : null,

		/** {Element} Stores the DOM element of the script tag */
		__elem : null,


		/**
		 * Not so nice yet. Used to make it possible to override
		 * the URI in derived classes. Needs a better implementation.
		 */
		_getUri : function() {
			return this.getUri().toString();
		},


		/**
		 * Finally start the HTTP request.
		 */
		load : function()
		{
			if (this.$$disposed) {
				return;
			}

			if (this.__elem) {
				throw new Error("Request is already running!");
			}

			// Create script element
			var script = this.__elem = document.createElement("script");

			// Place script element into head
			var head = document.getElementsByTagName("head")[0];

			// Define mimetype
			script.type = "text/javascript";

			// Attach handlers for all browsers
			script.onerror = script.onload = script.onreadystatechange = qx.lang.Function.bind(this.__onevent, this);

			// Setup URL
			script.src = this._getUri();

			// Finally append child
			// This will execute the script content
			head.appendChild(script);
		},


		/**
		 * Aborts a currently running process.
		 *
		 * @return {void}
		 */
		abort : function()
		{
			if (this.__elem) {
				this.__end("abort");
			}
		},


		/**
		 * Internal cleanup method used after every successful
		 * or failed loading attempt.
		 *
		 * @param status {String} Any of load, error or abort.
		 * @return {void}
		 */
		__end : function(status)
		{
			// Execute user callback
			this.fireEvent(status);

			// Fire done event
			this.fireEvent("done");

			// Directly dispose instance
			this.dispose();
		},


		/**
		 * Internal event listener for load and error events.
		 *
		 * @param e {Event} Native event object
		 * @return {void}
		 */
		__onevent : qx.core.Variant.select("qx.client",
		{
			"mshtml" : function()
			{
				var state = this.__elem.readyState;

				if (state == "loaded") {
					this.__end("load");
				} else if (state == "complete") {
					this.__end("load");
				}
			},

			"default" : function(e)
			{
				if (qx.lang.Type.isString(e) || e.type === "error") {
					this.__end("error");
				} else if (e.type === "load") {
					this.__end("load");
				} else if (e.type === "readystatechange" && (e.target.readyState === "complete" || e.target.readyState === "loaded")) {
					this.__end("load");
				}
			}
		})
	},




	/*
	*****************************************************************************
		 DESTRUCTOR
	*****************************************************************************
	*/

	destruct : function()
	{
		// Get script
		var script = this.__elem;
		if (script)
		{
			// Clear out listeners
			script.onerror = script.onload = script.onreadystatechange = null;

			// Remove script from head
			if (script.parentNode) {
				script.parentNode.removeChild(script);
			}
		}

		this.__elem = null;
	}
});
