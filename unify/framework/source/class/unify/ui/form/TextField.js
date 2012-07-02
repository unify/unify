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
core.Class("unify.ui.form.TextField", {
  include : [unify.ui.core.Widget, unify.ui.core.MInteractionState],
  
  properties : {
    /**
     * Type of input field, on some devices the input type changes teh behaviour of keyboard
     */
    type : {
      init : "text",
      type : ["text", "password", "telephone", "url", "email", "number"],
      apply : function(value, old) { this._applyType(value, old); }
    },
    
    // overridden
    appearance : {
      init: "input"
    },
    
    // overridden
    focusable : {
      init: true
    },

    autocomplete : {
      init: false
    },
    
    /**
     * Regular expression responsible for filtering the value of the input.
     * 
     * The following example only allows digits in the textfield.
     * <pre class='javascript'>field.setFilter(/[0-9]/);</pre>
     */
    filter : {
      //type : "RegExp",
      nullable : true,
      init : null
    },
    
    /** Maximal number of characters that can be entered in the TextArea. */
    maxLength : {
      type : "Integer",
      init : Infinity
    },
    
    placeholderValue: {
      type: 'String',
      init: '',
      apply: function(value, old) { this._applyPlaceholderValue(value, old); }
    }
  },
  
  events : {
    /** Fired on input */
    "input" : lowland.events.DataEvent,
    
    /** Fired on loosing focus */
    "changeValue" : lowland.events.DataEvent
  },
  
  construct : function(autocomplete) {
    this.__autocomplete = !(autocomplete === false);

    unify.ui.core.Widget.call(this);
    unify.ui.core.MInteractionState.call(this);
    
    this.addNativeListener("focus", this.__onFocus, this);
    this.addNativeListener("blur", this.__onBlur, this);
    
    this.addNativeListener("tap", function(e) {
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
    __autocomplete : false,
    
    _createElement : function() {
      var map = {
        "text" : "text",
        "password" : "password",
        "telephone" : "tel",
        "url" : "url",
        "email" : "email",
        "number" : "text"
      };
      
      var type = this.getType();
      
      var e = document.createElement("input");
      if (!this.__autocomplete) {
        e.setAttribute("autocomplete", "off");
      }
      e.setAttribute("type", map[type]);
      if (type == "number") {
        e.setAttribute("pattern", "[0-9]*");
      }
      this.addNativeListener(e, "input", this._onInput, this);

      return e;
    },
    
    /**
     * Apply placeholder value
     */
    _applyPlaceholderValue: function(placeholder) {
      this.__placeholderValue = placeholder;
      this.__onBlur();
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
    
    _applyType : function(value) {
      this.getElement().setAttribute("type", value);
    },
    
    /**
     * Event listener for native input events. Redirects the event
     * to the widget. Also checks for the filter and max length.
     *
     * @param e {Event} Input event
     */
    _onInput : function(e) {
      if (this.hasState("disable")) {
        return;
      }
      
      var value = this.getValue();
      var fireEvents = true;

      this.__nullValue = false;

      // value unchanged; Firefox fires "input" when pressing ESC [BUG #5309]
      if (this.__oldInputValue && this.__oldInputValue === value) {
        fireEvents = false;
      }

      // check for the filter
      if (this.getFilter() != null) {
        var filteredValue = "";
        var index = value.search(this.getFilter());
        var processedValue = value;
        while(index >= 0) {
          filteredValue = filteredValue + (processedValue.charAt(index));
          processedValue = processedValue.substring(index + 1, processedValue.length);
          index = processedValue.search(this.getFilter());
        }

        if (filteredValue != value) {
          fireEvents = false;
          value = filteredValue;
          this.setValue(value);
        }
      }

      // check for the max length
      if (value.length > this.getMaxLength()) {
        fireEvents = false;
        this.setValue(
          value.substr(0, this.getMaxLength())
        );
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
     * Blur handler to fire changeValue event
     */
    __onBlur : function() {
      if (this.__changed) {
        this.fireEvent("changeValue", this.getValue());
        this.__changed = false;
      }
      
      // Restore placeholder value if the currently set text is empty
      var currentValue = this.getValue();
      if (currentValue == '') {
        this.setValue(this.__placeholderValue);
      }
    },
    
    
     /**
     * Focus handler
     *
     * If this text field receives focus, we check if the current value of
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
        return;
      }
      //Fix for mousecatch after input
      this.setValue(currentValue);
    }
  }/*,
  
  destruct : function() {
    this.removeListener("blur", this.__onBlur, this);
    this.removeListener('focus', this.__onFocus, this);
  }*/
});
