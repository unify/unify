/*
===============================================================================================

		Unify Project

		Homepage: unify-project.org
		License: MIT + Apache (V2)
		Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/**
 * EXPERIMENTAL !
 * Input component
 */
core.Class("unify.ui.form.util.HtmlFileInput", {
	include : [unify.ui.core.Widget],

	properties : {
		// overridden
		appearance : {
			init: "input.file"
		}
	},

	events : {
		/** Fired on loosing focus */
		"changeValue" : core.event.Simple
	},

	construct : function() {
		unify.ui.core.Widget.call(this);
	},

	members : {
		__oldInputValue : null,
		__changed : false,

		_createElement : function() {
			var e = document.createElement("input");
			e.setAttribute("type", "file");
			this.addNativeListener(e, "change", this.__onInput, this);

			return e;
		},

		/**
		 * Sets input value
		 *
		 * @param value {String} Value to set on input field
		 */
		setValue : function(value) {
			this.__changed = true;
			this.getElement().value = value;
		},

		/**
		 * Gets input value
		 *
		 * @return {String} Value of input field
		 */
		getValue : function() {
			return this.getElement().value;
		},

		/**
		 * Event listener for native input events. Redirects the event
		 * to the widget. Also checks for the filter and max length.
		 *
		 * @param e {Event} Input event
		 */
		__onInput : function(e) {
			this.fireEvent("changeValue", e.target.files);
		}
	}
});
