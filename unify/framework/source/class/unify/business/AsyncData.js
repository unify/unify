/*
===============================================================================================

  	Unify Project

		Homepage: unify-project.org
		License: MIT + Apache (V2)
		Copyright: 2012 Sebastian Fastner, Mainz, Germany http://www.unify-training.com

===============================================================================================
*/
/**
 * Asynchronous data business object
 */
core.Class("unify.business.AsyncData",
{
	include : [unify.business.StaticData],



	/*
	----------------------------------------------------------------------------
		 CONSTRUCTOR
	----------------------------------------------------------------------------
	*/

	// overridden
	construct : function()
	{
		unify.business.StaticData.call(this);
	},



	/*
	----------------------------------------------------------------------------
		 EVENTS
	----------------------------------------------------------------------------
	*/

	events :
	{
		/**
		 * Fired whenever a communication with a service has been completed.
		 *
		 * Identify whether the event is interesting for you by the events ID property.
		 */
		"completed" : unify.business.CompletedEvent
	},



	/*
	----------------------------------------------------------------------------
		 MEMBERS
	----------------------------------------------------------------------------
	*/

	members :
	{
		/*
		---------------------------------------------------------------------------
			OVERRIDDEN
		---------------------------------------------------------------------------
		*/

		// overridden
		_readData : function(service, params)
		{
			return null;
		},
    
		getCachedEntry : function(service, params) {
			return null;
		},
		
		get : function(service, params) {
			var id = this._getCommunicationId();
			
			var callback = this.__callback.bind(this, id);
			this._requestData(service, params, id, callback);
			
			return id;
		},
		
		_requestData : function() {
			throw new Error("Please implement _requestData()!");
		},

		/** {Integer} Number of requests made (used for unique request IDs) */
		__requestCounter : 0,


		_getCommunicationId : function() {
			return this.__requestCounter++;
		},

		/**
		 * Event listener for request object
		 *
		 * @param e {lowland.events.Event} Event object of request
		 */
		__callback : function(id, data, isModified, isErrornous)
		{
			var event = new unify.business.CompletedEvent("completed", this, id, data, isModified !== false, isErrornous);
			this.dispatchEvent(event);
		}
	}
});
