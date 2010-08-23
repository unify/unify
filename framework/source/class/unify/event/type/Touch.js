/* ************************************************************************

	Unify Framework

	Copyright:
		2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

************************************************************************ */

/**
 * Event fired by {@link unify.event.handler.Touch}.
 */
qx.Class.define("unify.event.type.Touch",
{
	extend: qx.event.type.Native,
	
	
	/*
	*****************************************************************************
		MEMBERS
	*****************************************************************************
	*/
	
	members:
	{
		/**
		 * Get the number of touch objects in the given touch list.
		 * By default the number of fingers currently touching the screen.
		 *
		 * @param type {String ? null} The type of touch list
		 * @return {Integer} The number of touches
		 */
		getNumberOfTouches: function(type) {
			return this.__getTouchList(type).length;
		},
		
		
		/**
		 * Get the horizontal coordinate at which the event occurred relative
		 * to the view port depending on the touch object at given index in given list.
		 * (Doesn't include scroll offset.)
		 *
		 * @param index {Integer ? 0} The index of the touch
		 * @param type {String ? null} The type of touch list
		 * @return {Integer} The horizontal touch position
		 */
		getViewportLeft: function(index, type) {
			return this.__getTouch(index, type).clientX;
		},
		
		
		/**
		 * Get the vertical coordinate at which the event occurred relative
		 * to the view port depending on the touch object at given index in given list.
		 * (Doesn't include scroll offset.)
		 *
		 * @param index {Integer ? 0} The index of the touch
		 * @param type {String ? null} The type of touch list
		 * @return {Integer} The vertical touch position
		 */
		getViewportTop: function(index, type) {
			return this.__getTouch(index, type).clientY;
		},
		
		
		/**
		 * Get the horizontal coordinate at which the event occurred relative to
		 * the origin of the screen coordinate system
		 * depending on the touch object at given index in given list.
		 *
		 * Note: This value is usually not very useful unless you want to
		 * position a native pop-up window at this coordinate.
		 *
		 * @param index {Integer ? 0} The index of the touch
		 * @param type {String ? null} The type of touch list
		 * @return {Integer} The horizontal mouse position on the screen.
		 */
		getScreenLeft: function(index, type) {
			return this.__getTouch(index, type).screenX;
		},
		
		
		/**
		 * Get the vertical coordinate at which the event occurred relative to
		 * the origin of the screen coordinate system
		 * depending on the touch object at given index in given list.
		 *
		 * Note: This value is usually not very useful unless you want to
		 * position a native pop-up window at this coordinate.
		 *
		 * @param index {Integer ? 0} The index of the touch
		 * @param type {String ? null} The type of touch list
		 * @return {Integer} The vertical mouse position on the screen.
		 */
		getScreenTop: function(index, type) {
			return this.__getTouch(index, type).screenY;
		},
		
		
		/**
		 * Get the horizontal position at which the event occurred relative to the
		 * left of the document depending on the touch object at given index in given list.
		 * (Includes scroll offset.)
		 *
		 * @param index {Integer ? 0} The index of the touch
		 * @param type {String ? null} The type of touch list
		 * @return {Integer} The horizontal touch position in the document.
		 */
		getDocumentLeft: function(index, type) {
			return this.__getTouch(index, type).pageX;
		},
		
		
		/**
		 * Get the vertical position at which the event occurred relative to the
		 * top of the document depending on the touch object at given index in given list.
		 * (Includes scroll offset.)
		 *
		 * @param index {Integer ? 0} The index of the touch
		 * @param type {String ? null} The type of touch list
		 * @return {Integer} The vertical touch position in the document.
		 */
		getDocumentTop: function(index, type) {
			return this.__getTouch(index, type).pageY;
		},
		
		
		/**
		 * Returns a unique number which identifies the given touch object.
		 *
		 * @param index {Integer ? 0} The index of the touch
		 * @param type {String ? null} The type of touch list
		 * @return {Integer} unique identifier of the touch.
		 */
		getIdentifier: function(index, type) {
			return this.__getTouch(index, type).identifier;
		},
		
		
		/**
		 * Get the touch object at given index in given list.
		 *
		 * @param index {Integer ? 0} The index of the touch
		 * @param type {String ? null} The type of touch list
		 * @return {Object} The touch object
		 * @throws {Error} if the index (given as first argument) is out of bounds
		 *								 in the list specified with the second argument.
		 */
		__getTouch: function(index, type) 
		{
			var ret = this.__getTouchList(type)[index||0];
			if (!ret) {
				throw new Error("No such touch object, index out of bounds!");
			}
			
			return ret;
		},
		
		
		/**
		 * Get a list of touch objects depending on the given type.
		 * Type "target": All touches that originated in the same target node.
		 * Type "changed": Only touches that are involved in the current event call back.
		 * Type "touches": One object for each finger currently touching the screen.
		 * Default: changed
		 *
		 * @param type {String ? null} The type of touch list
		 * @return {Object[]} The list of touch objects
		 */
		__getTouchList: function(type) 
		{
			var nat = this._native;
			
			// emulate one finger touch events via mouse events for development purposes
			if (!nat.touches) 
			{
				// The identifier is the only missing value on the native mouse event
				// compared to a list entry from one of the touch lists
				nat.identifier = 0;
				
				// During touchend with no remaining finger the only content
				// is available in the changed touch list.
				/*if (nat.type === "mouseup" && type !== "changed") {
					return [];
				}*/
				
				// Emulating the list, but returning the event itself as first entry
				// as it has basically the same interfaces as an entry from the
				// touch lists returned below.
				return [nat];
			}
			
			switch (type) 
			{
				case "target":
					return nat.targetTouches;
					
				case "touches":
					return nat.touches;
					
				default:
					return nat.changedTouches;
			}
		}
	}
});
