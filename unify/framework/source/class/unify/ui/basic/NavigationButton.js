/*
===============================================================================================

		Unify Project

		Homepage: unify-project.org
		License: MIT + Apache (V2)
		Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/**
 * Button to support navigation
 *
 * EXPERIMENTAL
 */
 
core.Class("unify.ui.basic.NavigationButton", {
	include : [unify.ui.form.Button, unify.ui.core.MNavigatable],
	
	properties : {
		hoverForPopover : {
			init: false
		}
	},
	
	/**
	 * @param label {String} Label on button
	 */
	construct : function(label, image) {
		unify.ui.form.Button.call(this, label, image);
		
		this._applyMNavigatable();
	}
});
