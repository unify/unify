/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/*
#require(qx.event.handler.Input)
*/

/**
 * EXPERIMENTAL
 * Input component
 */
qx.Class.define("unify.ui.form.TextField", {
  extend : unify.ui.core.Widget,
  include : [unify.ui.core.MInteractionState],
  
  properties : {
    /**
     * Type of input field, on some devices the input type changes teh behaviour of keyboard
     */
    type : {
      init : "text",
      check : ["text", "password", "telephone", "url", "email", "number"],
      apply : "_applyType"
    },
    
    // overridden
    appearance :
    {
      refine: true,
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
      check : "RegExp",
      nullable : true,
      init : null
    },
    
    /** Maximal number of characters that can be entered in the TextArea. */
    maxLength : {
      check : "PositiveInteger",
      init : Infinity
    }
  },
  
  events : {
    /** Fired on input */
    "input" : "qx.event.type.Data",
    
    /** Fired on loosing focus */
    "changeValue" : "qx.event.type.Data"
  },
  
  construct : function() {
    this.base(arguments);
    
    this.addListener("blur", this.__onBlur, this);
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
      var attrib = {
        type : map[type]
      };
      if (type == "number") {
        attrib.pattern = "[0-9]*";
      }
      
      var e = qx.bom.Input.create("text", attrib);
      qx.event.Registration.addListener(e, "input", this._onInput, this);

      return e;
    },
    
    /**
     * Sets input value
     *
     * @param value {String} Value to set on input field
     */
    setValue : function(value) {
      this.__changed = true;
      qx.bom.Input.setValue(this.getElement(), value);
    },
    
    /**
     * Gets input value
     *
     * @return {String} Value of input field
     */
    getValue : function() {
      return qx.bom.Input.getValue(this.getElement());
    },
    
    _applyType : function(value) {
      qx.bom.element.Attribute.set(this.getElement(), "type", value);
    },
    
    /**
     * Event listener for native input events. Redirects the event
     * to the widget. Also checks for the filter and max length.
     *
     * @param e {qx.event.type.Data} Input event
     */
    _onInput : function(e) {
      var value = e.getData();
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
        this.fireDataEvent("input", value, this.__oldInputValue);
        this.__oldInputValue = value;
      }
    },
    
    /**
     * Blur handler to fire changeValue event
     */
    __onBlur : function() {
      if (this.__changed) {
        this.fireDataEvent("changeValue", this.getValue());
        this.__changed = false;
      }
    }
  },
  
  destruct : function() {
    this.removeListener("blur", this.__onBlur, this);
  }
});
