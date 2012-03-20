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
qx.Class.define("unify.ui.form.TextArea", {
  extend : unify.ui.core.Widget,
  
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
    appearance :
    {
      refine: true,
      init: "input"
    },
    
    placeholderValue: {
      check: 'String',
      init: '',
      apply: '_applyPlaceholderValue'
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
    
    // Register event listeners
    this.addListener('focus', this.__onFocus, this);
    this.addListener("blur", this.__onBlur, this);
  },
  
  members : {
    __placeholderValue: null,
    __oldInputValue : null,
    __changed : false,
    
    _createElement : function() {
      var e = qx.bom.Input.create("textarea", {
        rows: this.getRows(),
        cols: this.getColumns()
      });
      qx.event.Registration.addListener(e, "input", this._onInput, this);
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
      
      // fire the events, if necessary
      if (fireEvents) {
        this.__changed = true;
        
        // store the old input value
        this.fireDataEvent("input", value, this.__oldInputValue);
        this.__oldInputValue = value;
      }
    },
    
    /**
     * Set value of text area
     *
     * @param value {String} New value of text area
     */
    setValue : function(value) {
      qx.bom.Input.setValue(this.getElement(), value);
    },
    
    /**
     * Get value of text area
     *
     * @return {String} Value of text area
     */
    getValue : function() {
      return qx.bom.Input.getValue(this.getElement());
    },
    
    /**
     * Blur handler to fire changeValue event
     */
    __onBlur : function() {
      if (this.__changed) {
        this.fireDataEvent("changeValue", this.getValue());
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
     * If this text area receives focus, we check if the current value of
     * the text area is equal to the placeholder value. If that is the case,
     * we empty the box so the user may enter some text.
     *
     * @param e {qx.event.type.Focus} The focus event
     */
    __onFocus: function(e) {
      var currentValue = this.getValue();
      if (this.__placeholderValue != '' &&
          currentValue == this.__placeholderValue) {
        this.setValue('');
      }
    }
  },
  
  destruct : function() {
    this.removeListener("blur", this.__onBlur, this);
    this.removeListener('focus', this.__onFocus, this);
  }
});
