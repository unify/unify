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
 * Input component
 */
core.Class("unify.ui.form.TextArea", {
	include : [unify.ui.core.Widget],
	
	properties : {
		/** {Integer} Number of columns in text area */
		columns : {
			init: 50
		},
		
		/** {Integer} Number of rows in text area */
		rows : {
			init: 3
		},
		
		// overridden
		appearance : {
			init: "input"
		},
		
		placeholderValue: {
			type: 'String',
			init: '',
			apply: function(value, old) { this._applyPlaceholderValue(value, old); }
		},
		
		readOnly : {
			type: 'Boolean',
			init: false,
			apply: function(value) { if (value) this.getElement().setAttribute("readonly", "readonly"); else this.getElement().removeAttribute("readonly"); }
		}
	},
	
	events : {
		/** Fired on input */
		"input" : core.event.Simple, 
		
		/** Fired on loosing focus */
		"changeValue" : core.event.Simple
	},
	
	construct : function() {
		unify.ui.core.Widget.call(this);
		
		this.addNativeListener("focus", this.__onFocus, this);
		this.addNativeListener("blur", this.__onBlur, this);
		this.addNativeListener("tap", function() {
			if (this.hasState("disable")) {
				return;
			}
			
			this.focus();
		}, this);
	},
	
	members : {
		__placeholderValue: null,
		__oldInputValue : null,
		__changed : false,
		
		_createElement : function() {
			var e = document.createElement("textarea");
			e.setAttribute("rows", this.getRows());
			e.setAttribute("cols", this.getColumns());
			
			this.addNativeListener(e, "input", this._onInput, this);
			return e;
		},
		
		/**
		 * Apply placeholder value
		 */
		_applyPlaceholderValue: function(placeholder) {
      if (jasy.Env.isSet("html5.placeholder")) {
        var e = this.getElement();
        e.setAttribute("placeholder", placeholder);
      } else {
        this.__placeholderValue = placeholder;
        this.__onBlur();
      }
		},
		
		/**
		 * Event listener for native input events. Redirects the event
		 * to the widget. Also checks for the filter and max length.
		 *
		 * @param e {Event} Input event
		 */
		_onInput : function(e) {
			if (this.hasState("disable") || this.getReadOnly()) {
				return;
			}
			
			var value = this.getValue();
			var fireEvents = true;

			this.__nullValue = false;

			// value unchanged; Firefox fires "input" when pressing ESC [BUG #5309]
			if (this.__oldInputValue && this.__oldInputValue === value) {
				fireEvents = false;
			}
			
			// fire the events, if necessary
			if (fireEvents) {
				this.__changed = true;
				
				// store the old input value
				this.fireEvent("input", value, this.__oldInputValue);
				this.__oldInputValue = value;
			}
		},
		
		/**
		 * Sets input value
		 *
		 * @param value {String} Value to set on input field
		 */
		setValue : function(value) {
			this.__changed = true;
            
            if (value && value.length > 0) {
                this.removeState("placeholder");
            }
            
			this.getElement().value = value;
		},

		/**
		 * Get value of text area
		 *
		 * @return {String} Value of text area
		 */
		getValue : function() {
			return this.getElement().value;
		},
		
		/**
		 * Blur handler to fire changeValue event
		 */
		__onBlur : function() {
			if (this.__changed) {
				this.fireEvent("changeValue", this.getValue());
				this.__changed = false;
			}
			
            if (jasy.Env.isSet("html5.placeholder")) {
                var currentValue = this.getValue();
        		if (currentValue == '') {
                    this.addState("placeholder");
        		}
            } else {
    			// Restore placeholder value if the currently set text is empty
    			var currentValue = this.getValue();
    			if (currentValue == '') {
    				this.setValue(this.__placeholderValue);
    				if (this.__placeholderValue) {
    					this.addState("placeholder");
    				}
    			}
            }
		},		
		
		/**
		 * Focus handler
		 *
		 * If this text area receives focus, we check if the current value of
		 * the text area is equal to the placeholder value. If that is the case,
		 * we empty the box so the user may enter some text.
		 *
		 * @param e {qx.event.type.Focus} The focus event
		 */
		__onFocus: function(e) {
			if (this.hasState("disable")) {
				return;
			}
			
			var currentValue = this.getValue();
			if (this.__placeholderValue != '' &&
					currentValue == this.__placeholderValue) {
				this.setValue('');
			}
		}
	}/*,
	
	destruct : function() {
		this.removeListener("blur", this.__onBlur, this);
		this.removeListener('focus', this.__onFocus, this);
	}*/
});
