/*
===============================================================================================

		Unify Project

		Homepage: unify-project.org
		License: MIT + Apache (V2)
		Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

===============================================================================================
*/
/**
 * Event fired by {@link unify.event.handler.Gesture}.
 */
qx.Class.define("unify.event.type.Gesture",
{
	extend: qx.event.type.Native,


	/*
	----------------------------------------------------------------------------
		MEMBERS
	----------------------------------------------------------------------------
	 */

	members:
	{

		/**
		 * Returns the distance between two fingers since the start of the event,
		 * as a multiplier of the initial distance.
		 *
		 * The initial value is 1.0.
		 * If less than 1.0, the gesture is pinch close (to zoom out).
		 * If greater than 1.0, the gesture is pinch open (to zoom in).
		 *
		 * @return {Integer} scale of the gesture.
		 */
		getScale: function() {
			return this._native.scale;
		},


		/**
		 * Returns the delta rotation since the start of the event, in degrees,
		 * where clockwise is positive and counter-clockwise is negative.
		 *
		 * The initial value is 0.0.
		 *
		 * @return {Integer} rotation angle of the gesture in degrees.
		 */
		getRotation: function() {
			return this._native.rotation;
		}
	}
});
