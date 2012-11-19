/*
===============================================================================================

		Unify Project

		Homepage: unify-project.org
		License: MIT + Apache (V2)
		Copyright: 2012 Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/**
 * CheckBox
 */
core.Class("unify.ui.form.Radio", {
	include: [unify.ui.basic.Atom, unify.ui.core.MInteractionState],
	
	/**
	 * @param label {String} Label on atom
	 */
	construct : function(label, group, value, checked) {
		unify.ui.basic.Atom.call(this, label);
		unify.ui.core.MInteractionState.call(this);
		
		if (label) {
			var label = this.getChildControl("label");
			label.setAutoCalculateSize(true);
		}
		
		if (value !== undefined) {
			this.__value = value;
		} else {
			value = this.__value = label;
		}
		this.__group = group;
		
		unify.manager.RadioManager.register(group, value, this);
		
		this.setChecked(!!checked);
		
		this.addNativeListener("tap", this.__onTap, this);
	},

	properties: {
		// overridden
		appearance : {
			init: "radio"
		},
		
		/** Position of image */
		direction : {
			init : "left"
		},
		
		// overridden
		focusable : {
			init: true
		},
		
		checked : {
			type: "Boolean",
			init: false,
			apply: function(value) { this._applyChecked(value); }
		}
	},
	
	events : {
		/** Fired on change */
		"execute" : lowland.events.DataEvent
	},

	members: {
		
		__value : null,
		__group : null,
		
		/**
		 * onTap handler on button
		 *
		 * @param e {Event} Tap event
		 */
		__onTap : function(e) {
			if (this.hasState("disable")) {
				return;
			}
			
			// toggle checked state
			unify.manager.RadioManager.check(this.__group, this.__value);
		},
		
		/**
		 * Handles chanches on the "checked" property
		 * @param value {Boolean} if the checkbox is checked
		 */
		_applyChecked : function(value) {
			if (value) {
				this.addState("checked");
				this.fireEvent("execute", this.__value);
				unify.manager.RadioManager.uncheckOther(this.__group, this.__value);
			} else {
				this.removeState("checked");
			}
		}
	}
});
