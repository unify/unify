/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Event fired by {@link unify.bom.History}.
 */
qx.Class.define("unify.event.type.History",
{
	extend : qx.event.type.Event,

	members :
	{
		/** {String} Location */
		__location : null,

		/** {String} Previous location */
		__previous : null,


		/**
		 * Returns current location on page
		 *
		 * @return {String} Location
		 */
		getLocation : function() {
			return this.__location;
		},
		
		
		/**
		 * Returns the previous location on page
		 *
		 * @return {String} Location
		 */
		getPreviousLocation : function() {
			return this.__previous;
		},		
		
		
		/**
		 * Initializes an event object.
		 *
		 * @param location {String} Current in-document location
		 * @param previous {String} Previous browser in-document location
		 *
		 * @return {unify.event.type.History} the initialized instance.
		 */
		init : function(location, previous)
		{
			this.base(arguments, false, false);

			this.__location = location;
			this.__previous = previous;

			return this;
		},


		/**
		 * Get a copy of this object
		 *
		 * @param embryo {unify.event.type.History?null} Optional event class, which will
		 *		 be configured using the data of this event instance. The event must be
		 *		 an instance of this event class. If the data is <code>null</code>,
		 *		 a new pooled instance is created.
		 *
		 * @return {unify.event.type.History} a copy of this object
		 */
		clone : function(embryo)
		{
			var clone = this.base(arguments, embryo);

			clone.__location = this.__location;
			clone.__previous = this.__previous;
									
			return clone;
		}
	}
});
