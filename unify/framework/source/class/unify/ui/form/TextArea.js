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
    
    lowland.bom.Events.listen(this.getElement(), "blur", this.__onBlur.bind(this));
  },
  
  members : {
    __oldInputValue : null,
    __changed : false,
    
    _createElement : function() {
      var e = document.createElement("textarea");
      e.setAttribute("rows", this.getRows());
      e.setAttribute("cols", this.getColumns());
      
      lowland.bom.Events.listen(e, "input", this._onInput.bind(this));
      return e;
    },
    
    /**
     * Event listener for native input events. Redirects the event
     * to the widget. Also checks for the filter and max length.
     *
     * @param e {qx.event.type.Data} Input event
     */
    _onInput : function(e) {
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
     * Set value of text area
     *
     * @param value {String} New value of text area
     */
    setValue : function(value) {
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
    }
  }
});
