/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

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
      refine: true,
      init: true
    },
    
    /**
     * Regular expression responsible for filtering the value of the input.
     * 
     * The following example only allows digits in the textfield.
     * <pre class='javascript'>field.setFilter(/[0-9]/);</pre>
     */
    filter : {
      type : "RegExp",
      nullable : true,
      init : null
    },
    
    /** Maximal number of characters that can be entered in the TextArea. */
    maxLength : {
      type : "Integer",
      init : Infinity
    }
  },
  
  events : {
    /** Fired on input */
    "input" : lowland.events.DataEvent,
    
    /** Fired on loosing focus */
    "changeValue" : lowland.events.DataEvent
  },
  
  construct : function() {
    unify.ui.core.Widget.call(this);
    unify.ui.core.MInteractionState.call(this);
    
    lowland.bom.Events.listen(this.getElement(), "blur", this.__onBlur.bind(this));
  },
  
  members : {
    __oldInputValue : null,
    __changed : false,
    
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
      e.setAttribute("type", map[type]);
      if (type == "number") {
        e.setAttribute("pattern", "[0-9]*");
      }
      lowland.bom.Events.listen(e, "input", this._onInput.bind(this));

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
    }
  }
});
