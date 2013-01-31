/*
===============================================================================================

		Unify Project

		Homepage: unify-project.org
		License: MIT + Apache (V2)
		Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/**
 * Spacer widget
 */
core.Class("unify.ui.container.Spacer", {
	include: [unify.ui.core.Widget],
	
	properties : {
		// overridden
		appearance : {
			init: "spacer"
		}
	},
	
	construct : function() {
		unify.ui.core.Widget.call(this);
		this.setLayoutProperties({flex: 1});
	},
	
	members : {
		_createElement : function() {
			return new ebenejs.Div(); // document.createElement("div");
		}
	}
});