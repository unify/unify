/* ************************************************************************

	 Unify Framework

	 Copyright:
		 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

************************************************************************ */

/**
 * Event fired by {@link unify.event.handler.Orientation}.
 */
qx.Class.define("unify.event.type.Orientation",
{
	extend : qx.event.type.Event,

	members :
	{
		__mode : null,
		__orientation : null,


		/**
		 * Initialize the fields of the event. The event must be initialized before
		 * it can be dispatched.
		 *
		 * @param orientation {String} One of <code>0</code>, <code>90</code> or <code>-90</code>
		 * @param mode {String} <code>landscape</code> or <code>portrait</code>
		 * @return {qx.event.type.Event} The initialized event instance
		 */
		init : function(orientation, mode)
		{
			this.base(arguments, false, false);

			this.__orientation = orientation;
			this.__mode = mode;

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
		 * @return {unify.event.type.Orientation} a copy of this object
		 */
		clone : function(embryo)
		{
			var clone = this.base(arguments, embryo);

			clone.__orientation = this.__orientation;
			clone.__mode = this.__mode;

			return clone;
		},


		/**
		 * Gets the orientation degree value, typically 0 or 90 (-90, 270, -270).
		 * @return {Integer} Rotation degree.
		 */
		getOrientation: function() {
			return this.__orientation;
		},


		/**
		 * Gets the orientation mode.
		 * @return {String} "landscape" or "portrait".
		 */
		getMode: function() {
			return this.__mode;
		}
	}
});
