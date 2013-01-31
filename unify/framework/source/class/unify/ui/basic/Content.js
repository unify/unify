/*
===============================================================================================

		Unify Project

		Homepage: unify-project.org
		License: MIT + Apache (V2)
		Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/**
 * EXPERIMENTAL
 *
 *
 * Simple content widget based upon html DIV element
 */
core.Class("unify.ui.basic.Content", {
	include : [unify.ui.core.Widget],
	
	properties : {
		// overridden
		appearance : {
			init: "content"
		}
	},
	
	construct : function() {
		unify.ui.core.Widget.call(this);
	},
	
	members : {
		_createElement : function() {
			return new ebenejs.Div(); //document.createElement("div");
		}
	}
});
