/*
===============================================================================================

		Unify Project

		Homepage: unify-project.org
		License: MIT + Apache (V2)
		Copyright: 2011 Deutsche Telekom AG, Germany, http://telekom.com

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
		},

		scale : {
			init: false
		}
	},
	
	members : {
		
		// overridden
		_createElement : function() {
			var canvas = document.createElement("canvas");
			return canvas;
		}
	}
});
