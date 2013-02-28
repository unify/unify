/*
===============================================================================================

		Unify Project

		Homepage: unify-project.org
		License: MIT + Apache (V2)
		Copyright: 2010-2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/**
 * Composite
 */

core.Class("unify.ui.form.Combobox", {
	include : [unify.ui.basic.Atom],

	events : {
		/** Execute event when button is tapped */
		"execute" : core.event.Simple
	},

	/**
	 * @param label {String} Label on atom
	 * @param image {String} Image url
	 */
	construct : function(label, image) {
		unify.ui.basic.Atom.call(this, label, image);
		//unify.ui.core.MChildControl.call(this);
		
		//this.addListener("tap", this.__onTap, this);
	},

	properties: {
		// overridden
		appearance : {
			init: "combobox"
		},
		
		/** Position of image */
		direction : {
			init : "right"
		},

		// overridden
		focusable : {
			init: true
		},
		
		data : {
			init: null
		}
	},

	members: {
		__selected : null,
		__overlay : null,
		
		_createElement : function() {
			var e = unify.ui.basic.Atom.prototype._createElement.call(this);

			this.addNativeListener(e, "tap", this.__onTap, this);

			return e;
		},
		
		__getEntryById : function(id) {
			var data = this.getData();
			if (data) {
				for (var i=0, ii=data.length; i<ii; i++) {
					if (data[i].id == id) {
						return data[i];
					}
				}
			}
			
			return null;
		},

		/**
		 * Set button text
		 *
		 * @param value {String} Text of button
		 */
		setValue : function(value) {
			var d = this.__getEntryById(value);
			if (d) {
				this.__selected = d.id;
				this.setText(d.label);
			}
		},

		/**
		 * Returns text of button
		 *
		 * @return {String} Text of button
		 */
		getValue : function() {
			return this.__selected;
		},

		/**
		 * Returns child control widget identified by id
		 *
		 * @param id {String} ID of child widget
		 * @return {unify.ui.core.Widget} Content widget
		 */
		_createChildControlImpl : function(id) {
			var control;
			
			if (id == "overlay") {
				control = new unify.ui.container.Overlay();
				control.setRelativeTriggerPosition({x: "left", y: "bottom"});
			} else if (id == "expandable") {
				control = new unify.ui.container.Composite(new unify.ui.layout.VBox());
			}
			
			return control || unify.ui.basic.Atom.prototype._createChildControlImpl.call(this, id);
		},
		
		_createItem : function(data, parentAppearance) {
			var b = new unify.ui.form.Button(data.label);
			b.setAppearance(parentAppearance + "/button");
			return b;
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
			
			var overlay = this.getChildControl("overlay");
			overlay.setModal(false);
			var container = overlay.getChildControl("container");
			container.setWidth(this.getWidth());
			container.setAllowGrowX(false);
			container.setAllowShrinkY(true);
			container.setLayout(new unify.ui.layout.VBox());
			
			container.removeAll();
			
			var data = this.getData();
			var b;
			for (var i=0,ii=data.length; i<ii; i++) {
				b = this._createItem(data[i], container.getAppearance());
				b.setUserData("id", data[i].id);
				b.addListener("execute", this.__onButtonExecute, this);
				container.add(b);
			}
			overlay.add(container, {edge: 0});
			
			unify.ui.core.PopOverManager.getInstance().show(overlay, this)
		},
		
		__onButtonExecute : function(e) {
			unify.ui.core.PopOverManager.getInstance().hide(this.getChildControl("overlay"));
			var id = e.getTarget().getUserData("id");
			this.setValue(e.getTarget().getUserData("id"));
			this.fireEvent("execute", id);
		}
	}
});
