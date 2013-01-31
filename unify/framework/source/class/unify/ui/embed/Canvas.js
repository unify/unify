/*
===============================================================================================

		Unify Project

		Homepage: unify-project.org
		License: MIT + Apache (V2)
		Copyright: 2012 Sebastian Fastner

===============================================================================================
*/

/**
 * A simple widget that shows html content. 
 */
core.Class("unify.ui.embed.Canvas", {
	include : [unify.ui.core.Widget],
	
	construct : function() {
		unify.ui.core.Widget.call(this);
	},
	
	properties : {
		// overridden
		appearance : {
			init: "canvas"
		}
	},
	
	members : {
		__context : null,
		
		// overridden
		_createElement : function() {
			var canvas = document.createElement("canvas");
			this.__context = canvas.getContext("2d");
			return canvas;
		},
		
		// overridden
		_hasHeightForWidth : function() {
			return false;
		},
		
		/**
		 * Trigger invalidation of parent layout
		 */
		__invalidateParentLayout : function() {
			this.scheduleLayoutUpdate();
			var layoutParent = this.getParentBox();
			if (layoutParent) {
				layoutParent.getLayout().invalidateLayoutCache();
			}
		},

		context : function() {
			return this.__context;
		}
	}
});
