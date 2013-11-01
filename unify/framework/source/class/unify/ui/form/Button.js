/*
===============================================================================================

		Unify Project

		Homepage: unify-project.org
		License: MIT + Apache (V2)
		Copyright: 2010-2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/**
 * EXPERIMENTAL
 */

core.Class("unify.ui.form.Button", {
	include: [unify.ui.basic.Atom, unify.ui.core.MInteractionState],

	events : {
		/** Execute event when button is tapped */
		"execute" : core.event.Simple
	},

	properties: {
		// overridden
		appearance : {
			init: "button"
		},

		// overridden
		focusable : {
			init: true
		},
	
		/** @deprecated */	
		directEvent : {
			type: "Boolean",
			init: false
		},
		
		/** Wheter the button should calculate it's size -> property forwarded to label */
		autoCalculateSize : {
			type: "Boolean",
			init: false,
			apply: function(value) { this._applyAutoCalculateSize(value); }
		}
	},
	
	construct : function(label, image) {
		unify.ui.basic.Atom.call(this, label, image);
		unify.ui.core.MInteractionState.call(this);
	},

	members: {
		_createElement : function() {
			var element = unify.ui.basic.Atom.prototype._createElement.call(this);
			if(lowland.bom.Events.isSupported("touchend")){
				lowland.bom.Events.listen(element, "touchend", core.Function.bind(this.__onTap, this), false);
			} else {
				lowland.bom.Events.listen(element, "click", core.Function.bind(this.__onTap, this), false);
			}
			
			//this.addNativeListener(e, "tap", this.__onTap, this);

			return element;
		},

		/**
		 * Set button text
		 *
		 * @param value {String} Text of button
		 */
		setValue : function(value) {
			this.setText(value);
		},

		/**
		 * Returns text of button
		 *
		 * @return {String} Text of button
		 */
		getValue : function() {
			return this.getText();
		},

		/**
		 * onTap handler on button
		 *
		 * @param e {Event} Tap event
		 */
		__onTap : function(e) {
			if (this.hasState("disable")) {
				return;
			}
			
			this.fireEvent("execute");
		},
		
		/**
		 * Applies autoCalculateSize property to label
		 *
		 * @param value {Boolean} Label size should be automatic calculated
		 */
		_applyAutoCalculateSize : function(value) {
			this.getChildControl("label").setAutoCalculateSize(value);
		}
	}
});
