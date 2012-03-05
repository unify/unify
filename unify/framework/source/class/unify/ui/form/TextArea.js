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
      var e = qx.bom.Input.create("textarea", {
        rows: this.getRows(),
        cols: this.getColumns()
      });
      qx.event.Registration.addListener(e, "input", this._onInput, this);
      return e;
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
        this.fireEvent("input", value, this.__oldInputValue);
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
        this.fireEvent("changeValue", this.getValue());
        this.__changed = false;
      }
    }
  },
  
  destruct : function() {
    this.removeListener("blur", this.__onBlur, this);
  }
});
